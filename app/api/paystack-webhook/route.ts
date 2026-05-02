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

    const { reference, metadata, amount, customer } = event.data;

    // We use the webhook to INSERT because the frontend insert is blocked by Supabase RLS policies
    await supabase
      .from("fee_payments")
      .insert({
        reference: reference,
        student_id: metadata.student_id,
        email: customer?.email || metadata.custom_fields?.[0]?.value,
        amount: amount / 100, // Paystack sends amounts in Kobo, convert back to Naira
        status: "success"
      });
  }

  return new NextResponse("Webhook Processed", { status: 200 });
}
