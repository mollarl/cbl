import "server-only";
import { neon } from "@neondatabase/serverless";

export function adminSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for the admin panel");
  return neon(url);
}
