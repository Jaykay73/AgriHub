import { NextResponse } from "next/server";
import type { CreditInputPayload } from "@/features/loans/lib/buildCreditPayload";
import { logger } from "@/lib/logger";

const ML_BASE = "https://agrihub-ml-production-63b0.up.railway.app";
const UPSTREAM_TIMEOUT_MS = 12_000;

type PredictResponse = {
  credit_score: number;
  loan_eligible: boolean;
  probability_of_eligibility: number;
};

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const isValidPayload = (body: unknown): body is CreditInputPayload => {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  return (
    isFiniteNumber(o.total_sales) &&
    typeof o.num_transactions === "number" &&
    Number.isInteger(o.num_transactions) &&
    o.num_transactions >= 0 &&
    isFiniteNumber(o.avg_transaction_value) &&
    isFiniteNumber(o.activity_frequency) &&
    isFiniteNumber(o.repayment_history) &&
    typeof o.high_value_tx_count === "number" &&
    Number.isInteger(o.high_value_tx_count) &&
    o.high_value_tx_count >= 0 &&
    isFiniteNumber(o.blockchain_verified_ratio)
  );
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    if (!isValidPayload(body)) {
      return NextResponse.json({ error: "Invalid credit prediction payload." }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    let upstream: Response;
    try {
      upstream = await fetch(`${ML_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      logger.error("api/credit/predict", isAbort ? "ML upstream timeout" : "ML upstream fetch failed", {
        message: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        { error: isAbort ? "Credit service timed out. Try again." : "Credit service unavailable." },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeout);
    }

    const raw: unknown = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      logger.warn("api/credit/predict", "ML upstream returned error status", {
        status: upstream.status,
        body: raw,
      });
      return NextResponse.json(
        { error: "Credit scoring failed. Try again later." },
        { status: upstream.status >= 500 ? 502 : 400 },
      );
    }

    if (
      !raw ||
      typeof raw !== "object" ||
      typeof (raw as PredictResponse).credit_score !== "number" ||
      typeof (raw as PredictResponse).loan_eligible !== "boolean" ||
      typeof (raw as PredictResponse).probability_of_eligibility !== "number"
    ) {
      logger.error("api/credit/predict", "Unexpected ML response shape", { raw });
      return NextResponse.json({ error: "Invalid response from credit service." }, { status: 502 });
    }

    return NextResponse.json(raw as PredictResponse);
  } catch (err) {
    logger.error("api/credit/predict", "Unexpected error", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
