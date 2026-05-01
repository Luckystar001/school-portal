import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  // 1. Verify the request is actually from Paystack
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  if (hash !== signature) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. If the payment was successful, update the database
  if (event.event === "charge.success") {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // This key bypasses RLS
    );

    const { reference, metadata } = event.data;

    await supabase
      .from("fee_payments")
      .update({ status: "success" })
      .eq("reference", reference);
  }

  return new NextResponse("Webhook Processed", { status: 200 });
}
