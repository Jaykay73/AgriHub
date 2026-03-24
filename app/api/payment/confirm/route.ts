import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { reference?: string; status?: string };
    const { reference, status } = body;

    if (!reference || !status) {
      return NextResponse.json({ error: "Missing reference or status." }, { status: 400 });
    }

    const response = await fetch(new URL("/api/payment/webhook", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        status,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to confirm payment." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to confirm payment." }, { status: 500 });
  }
}
