import { createHmac } from "crypto";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";

const verifySignature = (payload: string, signature?: string | null) => {
  const secret = process.env.INTERSWITCH_WEBHOOK_SECRET;
  if (!secret) return true;
  if (!signature) return false;
  const digest = createHmac("sha256", secret).update(payload).digest("hex");
  return digest === signature;
};

export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firebase is not configured." }, { status: 500 });
    }

    const rawPayload = await request.text();
    const signature =
      request.headers.get("x-interswitch-signature") ||
      request.headers.get("x-signature");

    if (!verifySignature(rawPayload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawPayload) as Record<string, unknown>;
    const orderId = String(payload.orderId ?? payload.order_id ?? "");
    const reference = String(payload.reference ?? payload.txn_ref ?? "");
    const status = String(payload.status ?? payload.paymentStatus ?? "").toLowerCase();
    const amountInKobo = Number(payload.amount ?? 0);

    const isPaid = ["success", "paid", "completed"].includes(status);
    let orderIds: string[] = [];
    if (orderId) {
      orderIds = [orderId];
    } else if (reference) {
      const sessionSnap = await getDoc(doc(db, "paymentSessions", reference));
      if (sessionSnap.exists()) {
        orderIds = ((sessionSnap.data() as { orderIds?: string[] }).orderIds || []).filter(Boolean);
      }
      if (!orderIds.length) {
        const byRef = await getDocs(query(collection(db, "orders"), where("paymentReference", "==", reference)));
        orderIds = byRef.docs.map((entry) => entry.id);
      }
    }

    if (!orderIds.length) {
      return NextResponse.json({ error: "No matching orders found for payment." }, { status: 400 });
    }

    for (const currentOrderId of orderIds) {
      await updateDoc(doc(db, "orders", currentOrderId), {
        status: isPaid ? "paid" : "pending",
        paymentStatus: isPaid ? "paid" : "failed",
        paymentReference: reference,
        updatedAt: serverTimestamp(),
      });

      const orderSnap = await getDoc(doc(db, "orders", currentOrderId));
      const order = orderSnap.exists() ? (orderSnap.data() as Record<string, unknown>) : {};
      const orderAmountInKobo = Number(order.amountInKobo ?? 0);

      const transactionRef = await addDoc(collection(db, "transactions"), {
        orderId: currentOrderId,
        buyerId: String(order.buyerId ?? ""),
        farmerId: String(order.farmerId ?? ""),
        amountInKobo: orderAmountInKobo || amountInKobo || 0,
        currency: "NGN",
        paymentReference: reference,
        paymentStatus: isPaid ? "paid" : "failed",
        createdAt: serverTimestamp(),
      });

      void fetch(new URL("/api/blockchain/record", request.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transactionRef.id,
          orderId: currentOrderId,
          amount: orderAmountInKobo || amountInKobo || 0,
          farmerId: String(order.farmerId ?? ""),
          buyerId: String(order.buyerId ?? ""),
        }),
      });
    }

    logger.info("payment/webhook", "Webhook processed", {
      orderIds,
      reference,
      status,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("payment/webhook", "Webhook processing failed", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
