import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Placeholder for future AI/chat integration.
  // Expected to accept message history; for now, return an empty response.
  try {
    await req.json();
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true, reply: "" }, { status: 200 });
}

