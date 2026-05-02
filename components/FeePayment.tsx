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
    try {
      toast.info("Verifying payment...");
      
      // Call our secure backend API to insert the record (bypasses RLS)
      const res = await fetch("/api/save-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference.reference,
          student_id: studentProfile.id,
          email: studentProfile.email,
          amount: amount,
        }),
      });

      if (res.ok) {
        toast.success("Transaction Complete. Fees Updated!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        console.error("Backend failed to save payment");
        toast.error("Payment received, but failed to update dashboard. Please contact support.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving the payment.");
    }
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
