import { randomUUID } from "crypto";
import { collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";

type Body = {
  orderIds: string[];
  amount: number;
  email: string;
  callbackUrl: string;
};

type PaymentRequest = {
  action: string;
  fields: Record<string, string>;
  reference: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const { orderIds, amount, email, callbackUrl } = body;

    if (!db) {
      return NextResponse.json(
        { error: "Firebase is not configured." },
        { status: 500 },
      );
    }
    const dbClient = db;
    if (!orderIds?.length || !amount || !email || !callbackUrl) {
      return NextResponse.json(
        { error: "Missing required payment fields." },
        { status: 400 },
      );
    }

    const reference = `AGH-${Date.now()}-${randomUUID().slice(0, 8)}`;

    const merchantCode = process.env.INTERSWITCH_MERCHANT_CODE;
    const payItemId = process.env.INTERSWITCH_PAY_ITEM_ID;
    const dataRef = process.env.INTERSWITCH_DATA_REF || "";
    const configuredBaseUrl = process.env.INTERSWITCH_BASE_URL?.trim();
    const baseUrl =
      configuredBaseUrl && configuredBaseUrl.includes("sandbox.interswitchng.com")
        ? "https://newwebpay.qa.interswitchng.com"
        : configuredBaseUrl || "https://newwebpay.qa.interswitchng.com";

    if (!merchantCode || !payItemId) {
      logger.error("payment/initiate", "Missing Interswitch merchant configuration");
      return NextResponse.json(
        {
          error:
            "Payment is not configured. Set INTERSWITCH_MERCHANT_CODE and INTERSWITCH_PAY_ITEM_ID.",
        },
        { status: 500 },
      );
    }

    const paymentFields: Record<string, string> = {
      merchant_code: merchantCode,
      pay_item_id: payItemId,
      txn_ref: reference,
      amount: String(amount),
      currency: "566",
      site_redirect_url: callbackUrl,
      cust_email: email,
    };
    if (dataRef) paymentFields.data_ref = dataRef;

    await Promise.all(
      orderIds.map((orderId) =>
        updateDoc(doc(dbClient, "orders", orderId), {
          paymentReference: reference,
          updatedAt: serverTimestamp(),
        }),
      ),
    );

    await setDoc(doc(collection(dbClient, "paymentSessions"), reference), {
      reference,
      orderIds,
      amountInKobo: amount,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const paymentRequest: PaymentRequest = {
      action: `${baseUrl}/collections/w/pay`,
      fields: paymentFields,
      reference,
    };

    logger.info("payment/initiate", "Payment initiated", { orderIds, reference });
    return NextResponse.json(paymentRequest);
  } catch (error) {
    logger.error("payment/initiate", "Payment initiation failed", error);
    return NextResponse.json(
      { error: "Unable to initiate payment." },
      { status: 500 },
    );
  }
}
