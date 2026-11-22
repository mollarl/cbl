import { neon } from "@neondatabase/serverless";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { CandidatePayload, CandidateRecord } from "./types";

const localStore = path.join(process.cwd(), ".data", "candidates.json");

function now() {
  return new Date().toISOString();
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSupplement(input: Record<string, unknown>) {
  return {
    role: clean(input.role),
    communityExperience: clean(input.communityExperience),
    communityType: clean(input.communityType),
    communityAge: clean(input.communityAge),
    participantCount: clean(input.participantCount),
    workMode: clean(input.workMode),
    previousExperience: clean(input.previousExperience),
    mainChallenge: clean(input.mainChallenge),
    motivation: clean(input.motivation),
    contribution: clean(input.contribution),
    expectations: clean(input.expectations),
    topics: clean(input.topics),
    imageConsent: input.imageConsent === true,
  };
}

export function normalizeCandidate(input: Record<string, unknown>): CandidatePayload {
  return {
    fullName: clean(input.fullName),
    email: clean(input.email).toLowerCase(),
    location: clean(input.location),
    linkedinUrl: clean(input.linkedinUrl) || null,
    whatsapp: clean(input.whatsapp),
  };
}

function validateBase(candidate: CandidatePayload) {
  const required: Array<keyof CandidatePayload> = [
    "fullName",
    "email",
    "location",
    "whatsapp",
  ];
  const missing = required.filter((key) => !candidate[key]);
  if (missing.length) return `Completá los campos requeridos: ${missing.join(", ")}.`;
  if (!/^\S+@\S+\.\S+$/.test(candidate.email)) return "Ingresá un correo electrónico válido.";
  return null;
}

async function readLocal(): Promise<CandidateRecord[]> {
  try {
    return JSON.parse(await fs.readFile(localStore, "utf8")) as CandidateRecord[];
  } catch {
    return [];
  }
}

async function writeLocal(records: CandidateRecord[]) {
  await fs.mkdir(path.dirname(localStore), { recursive: true });
  await fs.writeFile(localStore, JSON.stringify(records, null, 2));
}

export async function createCandidate(input: Record<string, unknown>) {
  const candidate = normalizeCandidate(input);
  const error = validateBase(candidate);
  if (error) throw new Error(error);

  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      INSERT INTO candidates (full_name, email, location, linkedin_url, whatsapp)
      VALUES (${candidate.fullName}, ${candidate.email}, ${candidate.location}, ${candidate.linkedinUrl}, ${candidate.whatsapp})
      RETURNING id, created_at, updated_at
    `;
    const row = rows[0] as { id: string; created_at: Date; updated_at: Date };
    return { id: row.id, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() };
  }

  const timestamp = now();
  const record: CandidateRecord = {
    ...candidate,
    id: randomUUID(),
    status: "pending",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const records = await readLocal();
  records.push(record);
  await writeLocal(records);
  return { id: record.id, createdAt: timestamp, updatedAt: timestamp };
}

export async function updateCandidate(id: string, input: Record<string, unknown>) {
  const candidate = normalizeSupplement(input);

  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      UPDATE candidates
      SET role = COALESCE(NULLIF(${candidate.role}, ''), role),
          community_experience = COALESCE(NULLIF(${candidate.communityExperience}, ''), community_experience),
          community_type = COALESCE(NULLIF(${candidate.communityType}, ''), community_type),
          community_age = COALESCE(NULLIF(${candidate.communityAge}, ''), community_age),
          participant_count = COALESCE(NULLIF(${candidate.participantCount}, ''), participant_count),
          work_mode = COALESCE(NULLIF(${candidate.workMode}, ''), work_mode),
          previous_experience = COALESCE(NULLIF(${candidate.previousExperience}, ''), previous_experience),
          main_challenge = COALESCE(NULLIF(${candidate.mainChallenge}, ''), main_challenge),
          motivation = COALESCE(NULLIF(${candidate.motivation}, ''), motivation),
          contribution = COALESCE(NULLIF(${candidate.contribution}, ''), contribution),
          expectations = COALESCE(NULLIF(${candidate.expectations}, ''), expectations),
          topics = COALESCE(NULLIF(${candidate.topics}, ''), topics),
          image_consent = ${candidate.imageConsent},
          updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING id
    `;
    if (!rows.length) throw new Error("No encontramos ese registro.");
    return { id };
  }

  const records = await readLocal();
  const index = records.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("No encontramos ese registro.");
  const answers = Object.fromEntries(Object.entries(candidate).filter(([, value]) => value !== ""));
  records[index] = { ...records[index], ...answers, updatedAt: now() };
  await writeLocal(records);
  return { id };
}
