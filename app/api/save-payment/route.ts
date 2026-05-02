import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference, student_id, email, amount } = body;

    if (!reference || !student_id) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("fee_payments").insert({
      reference,
      student_id,
      email,
      amount,
      status: "success",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      // Even if there's a unique constraint violation (e.g. webhook already fired),
      // we can still return success to the frontend
      if (error.code === '23505') { 
        return NextResponse.json({ success: true, message: "Already inserted" });
      }
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Save payment error:", err);
    return new NextResponse(err.message, { status: 500 });
  }
}
