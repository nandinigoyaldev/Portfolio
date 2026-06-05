import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Placeholder: wire up Formspree/DB/Email later.
  // For now, respond with 200 so the UI is functional.
  try {
    await req.formData();
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

