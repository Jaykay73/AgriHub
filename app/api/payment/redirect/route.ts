import { NextResponse } from "next/server";

const mapStatusFromResponseCode = (resp: string) => {
  if (resp === "00") return "paid";
  if (resp === "09") return "pending";
  return "failed";
};

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const nextPath = url.searchParams.get("next") || "/orders/callback";
    const formData = await request.formData();

    const txnref = String(formData.get("txnref") || formData.get("txn_ref") || "");
    const resp = String(formData.get("resp") || "");
    const amount = String(formData.get("amount") || "");
    const status = mapStatusFromResponseCode(resp);

    const redirectUrl = new URL(nextPath, request.url);
    if (txnref) redirectUrl.searchParams.set("txn_ref", txnref);
    if (amount) redirectUrl.searchParams.set("amount", amount);
    redirectUrl.searchParams.set("status", status);
    if (resp) redirectUrl.searchParams.set("resp", resp);

    return NextResponse.redirect(redirectUrl);
  } catch {
    return NextResponse.redirect(new URL("/orders/callback?status=failed", request.url));
  }
}
