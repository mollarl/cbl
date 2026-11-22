import { createHash, randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const email = process.argv[2]?.trim().toLowerCase();
const output = process.argv[3];
const url = process.env.DATABASE_URL;
if (!email || !/^\S+@\S+\.\S+$/.test(email) || !url) {
  console.error("Configurá DATABASE_URL y ejecutá npm run admin:invite -- correo@example.com.");
  process.exit(1);
}

const code = randomBytes(24).toString("hex");
const hash = createHash("sha256").update(code).digest("hex");
try {
  const sql = neon(url);
  const rows = await sql`
    INSERT INTO admin_users (email, activation_hash, activation_expires_at)
    VALUES (${email}, ${hash}, now() + interval '48 hours')
    ON CONFLICT (email) DO UPDATE SET
      activation_hash = EXCLUDED.activation_hash,
      activation_expires_at = EXCLUDED.activation_expires_at,
      login_attempts = 0,
      login_window_started_at = NULL
    WHERE admin_users.password_hash IS NULL AND admin_users.enabled
    RETURNING id
  `;
  if (rows.length !== 1) {
    console.error("La cuenta ya tiene contraseña o está deshabilitada.");
    process.exitCode = 1;
  } else if (output) {
    await writeFile(output, code + "\n", { flag: "wx", mode: 0o600 });
    console.log("Código de activación guardado en el archivo privado. Es válido durante 48 horas.");
  } else {
    console.log("Código de activación válido durante 48 horas. Compartilo por un canal privado.");
    console.log(code);
  }
} catch {
  console.error("No se pudo generar la invitación. Verificá la conexión y que 003_admin.sql esté aplicada.");
  process.exitCode = 1;
}
