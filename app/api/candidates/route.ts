import { NextResponse } from "next/server";
import { createCandidate } from "@/lib/candidate-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const candidate = await createCandidate(body);
    return NextResponse.json({ ok: true, candidate }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "No pudimos guardar tu registro." },
      { status: 400 },
    );
  }
}
