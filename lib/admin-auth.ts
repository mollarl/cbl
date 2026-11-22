import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSql } from "./admin-db";

const deriveKey = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  length: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;
const scryptOptions = { N: 2 ** 17, r: 8, p: 1, maxmem: 192 * 1024 * 1024 };
const dummyHash = `scrypt-v1:${"0".repeat(32)}:${"0".repeat(128)}`;
const sessionCookie = "cbl_admin_session";
const sessionHours = 8;

type AdminAuthRow = {
  id: string;
  password_hash: string | null;
  activation_hash: string | null;
  activation_valid: boolean;
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, 64, scryptOptions);
  return `scrypt-v1:${salt.toString("hex")}:${key.toString("hex")}`;
}

async function verifyPassword(password: string, hash: string) {
  if (!/^scrypt-v1:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash)) return false;
  const [, salt, expected] = hash.split(":");
  const key = await deriveKey(password, Buffer.from(salt, "hex"), 64, scryptOptions);
  return timingSafeEqual(key, Buffer.from(expected, "hex"));
}

async function takeLoginAttempt(email: string) {
  const sql = adminSql();
  const [account] = await sql`
    UPDATE admin_users
    SET login_attempts = CASE
          WHEN login_window_started_at > now() - interval '15 minutes' THEN login_attempts + 1
          ELSE 1
        END,
        login_window_started_at = CASE
          WHEN login_window_started_at > now() - interval '15 minutes' THEN login_window_started_at
          ELSE now()
        END
    WHERE email = ${email} AND enabled
      AND (login_attempts < 8 OR login_window_started_at <= now() - interval '15 minutes')
    RETURNING id, password_hash, activation_hash, activation_expires_at > now() AS activation_valid
  `;
  return account as AdminAuthRow | undefined;
}

export async function signInAdmin(
  email: string,
  password: string,
  activationCode: string,
) {
  const account = await takeLoginAttempt(email);
  const sql = adminSql();
  const token = randomBytes(32).toString("hex");
  const tokenHash = sha256(token);
  const expires = new Date(Date.now() + sessionHours * 60 * 60 * 1000);
  let sessions: unknown[];

  if (activationCode) {
    const codeHash = sha256(activationCode);
    const hasValidCode = account?.activation_valid && account.activation_hash
      && /^[a-f0-9]{64}$/.test(account.activation_hash)
      && timingSafeEqual(Buffer.from(codeHash, "hex"), Buffer.from(account.activation_hash, "hex"));

    if (!account || account.password_hash || !hasValidCode) {
      await verifyPassword(password, dummyHash);
      return false;
    }

    const passwordHash = await hashPassword(password);
    // The same statement consumes the invitation and creates its first session.
    sessions = await sql`
      WITH activated AS (
        UPDATE admin_users
        SET password_hash = ${passwordHash}, activation_hash = NULL, activation_expires_at = NULL,
            login_attempts = 0, login_window_started_at = NULL
        WHERE id = ${account.id} AND enabled AND password_hash IS NULL
          AND activation_hash = ${codeHash} AND activation_expires_at > now()
        RETURNING id
      )
      INSERT INTO admin_sessions (token_hash, admin_id, expires_at)
      SELECT ${tokenHash}, id, ${expires.toISOString()} FROM activated
      RETURNING admin_id
    `;
  } else {
    const matches = await verifyPassword(password, account?.password_hash ?? dummyHash);
    if (!account?.password_hash || !matches) return false;

    sessions = await sql`
      WITH authenticated AS (
        UPDATE admin_users
        SET login_attempts = 0, login_window_started_at = NULL
        WHERE id = ${account.id} AND enabled AND password_hash = ${account.password_hash}
        RETURNING id
      )
      INSERT INTO admin_sessions (token_hash, admin_id, expires_at)
      SELECT ${tokenHash}, id, ${expires.toISOString()} FROM authenticated
      RETURNING admin_id
    `;
  }

  if (!sessions.length) return false;
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/admin",
  });
  return true;
}

export async function getAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token) || !process.env.DATABASE_URL) return null;

  const sql = adminSql();
  const [admin] = await sql`
    SELECT admin_users.id, admin_users.email
    FROM admin_sessions JOIN admin_users ON admin_users.id = admin_sessions.admin_id
    WHERE token_hash = ${sha256(token)} AND expires_at > now() AND enabled
      AND password_hash IS NOT NULL
  `;
  return (admin as { id: string; email: string } | undefined) ?? null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin");
  return admin;
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token) && process.env.DATABASE_URL) {
    const sql = adminSql();
    await sql`DELETE FROM admin_sessions WHERE token_hash = ${sha256(token)}`;
  }
  cookieStore.set(sessionCookie, "", { expires: new Date(0), path: "/admin" });
}
