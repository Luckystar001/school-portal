"use client";

import { usePaystackPayment } from "react-paystack";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FeePayment({
  studentProfile,
  amount,
}: {
  studentProfile: any;
  amount: number;
}) {
  const supabase = createClient();

  const config = {
    reference: new Date().getTime().toString(),
    email: studentProfile.email,
    amount: amount * 100, // Convert Naira to Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: {
      student_id: studentProfile.id,
      custom_fields: [
        {
          display_name: "Student Name",
          variable_name: "student_name",
          value: `${studentProfile.first_name} ${studentProfile.last_name}`,
        },
      ],
    },
  };

  const onSuccess = async (reference: any) => {
    // Attempt to save to Supabase from frontend (will likely fail if RLS is strict)
    // But we don't care about the error because the Paystack Webhook will insert the record reliably
    await supabase.from("fee_payments").insert({
      student_id: studentProfile.id,
      email: studentProfile.email,
      amount: amount,
      reference: reference.reference,
      status: "success",
    });

    // Always show success and reload, as Paystack has confirmed payment locally
    // The webhook will handle the actual database insertion in the background
    toast.success("Transaction Complete. Verifying payment...");
    setTimeout(() => window.location.reload(), 1500);
  };

  const onClose = () => {
    toast.info("Payment session ended.");
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <Button
      onClick={() => initializePayment({ onSuccess, onClose })}
      className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95"
    >
      Pay School Fees (₦{amount.toLocaleString()})
    </Button>
  );
}
