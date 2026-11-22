import "server-only";
import { adminSql } from "./admin-db";
import { adminFields, type AdminField, type CandidateStatus, type CandidateValue } from "./admin-fields";

export const pageSize = 10;

type CandidateSummary = {
  id: string;
  full_name: string;
  email: string;
  location: string;
  whatsapp: string;
  status: CandidateStatus;
  created_at: string;
};

export type CandidateDetail = CandidateSummary & Record<AdminField, CandidateValue> & { updated_at: string };

export function candidateIdIsValid(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
}

export async function listAdminCandidates(search: string, requestedPage: number) {
  const sql = adminSql();
  const pattern = "%" + search.replace(/[\\%_]/g, "\\$&") + "%";
  const [result] = await sql`
    WITH matching AS MATERIALIZED (
      SELECT id, full_name, email, location, whatsapp, status, created_at
      FROM candidates
      WHERE ${search} = '' OR
        concat_ws(' ', full_name, email, location, whatsapp, linkedin_url, role,
          community_experience, community_type, community_age, participant_count, work_mode,
          previous_experience, main_challenge, motivation, contribution, expectations, topics)
        ILIKE ${pattern}
    ),
    pagination AS (
      SELECT count(*)::int AS total,
        least(${requestedPage}::int, greatest(1, ceil(count(*)::numeric / ${pageSize}::int)))::int AS page
      FROM matching
    )
    SELECT total, page, COALESCE((
      SELECT json_agg(item ORDER BY item.created_at DESC, item.id DESC)
      FROM (
        SELECT * FROM matching ORDER BY created_at DESC, id DESC LIMIT ${pageSize}
        OFFSET (SELECT (page - 1) * ${pageSize} FROM pagination)
      ) AS item
    ), '[]'::json) AS candidates
    FROM pagination
  `;
  return result as { total: number; page: number; candidates: CandidateSummary[] };
}

export async function getAdminCandidate(id: string) {
  const sql = adminSql();
  const columns = Object.keys(adminFields).join(", ");
  const [row] = await sql.query(
    `SELECT to_jsonb(candidate) AS candidate FROM (
      SELECT id, created_at, updated_at, ${columns} FROM candidates WHERE id = $1::uuid
    ) AS candidate`,
    [id],
  );
  return (row?.candidate as CandidateDetail | undefined) ?? null;
}

export async function setAdminCandidateField(id: string, field: AdminField, value: CandidateValue) {
  if (!Object.hasOwn(adminFields, field)) return false;
  const sql = adminSql();
  const rows = await sql.query(
    `UPDATE candidates SET ${field} = $2, updated_at = now() WHERE id = $1::uuid RETURNING id`,
    [id, value],
  );
  return rows.length === 1;
}

export async function deleteAdminCandidate(id: string) {
  const sql = adminSql();
  const rows = await sql`DELETE FROM candidates WHERE id = ${id}::uuid RETURNING id`;
  return rows.length === 1;
}
