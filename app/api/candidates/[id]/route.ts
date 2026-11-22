import { NextResponse } from "next/server";
import { updateCandidate } from "@/lib/candidate-store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const candidate = await updateCandidate(id, body);
    return NextResponse.json({ ok: true, candidate });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "No pudimos actualizar tu registro." },
      { status: 400 },
    );
  }
}
