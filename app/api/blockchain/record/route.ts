import { doc, updateDoc } from "firebase/firestore";
import { keccak256, toUtf8Bytes } from "ethers";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { logger } from "@/lib/logger";

type Body = {
  transactionId: string;
  orderId: string;
  amount: number;
  farmerId: string;
  buyerId: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const payload = {
      transactionId: body.transactionId,
      orderId: body.orderId,
      amount: body.amount,
      farmerId: body.farmerId,
      buyerId: body.buyerId,
    };
    const blockchainHash = keccak256(toUtf8Bytes(JSON.stringify(payload)));
    const polygonTxHash = `mock-polygon-${Date.now()}`;

    if (db && body.transactionId) {
      await updateDoc(doc(db, "transactions", body.transactionId), {
        blockchainHash,
        polygonTxHash,
      });
    }

    logger.info("blockchain/record", "Blockchain stub recorded", {
      transactionId: body.transactionId,
      blockchainHash,
    });

    return NextResponse.json({ polygonTxHash, blockchainHash });
  } catch (error) {
    logger.error("blockchain/record", "Blockchain record failed", error);
    return NextResponse.json(
      { error: "Unable to record blockchain transaction." },
      { status: 500 },
    );
  }
}
