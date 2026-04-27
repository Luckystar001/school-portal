"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SignUpSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); // 5 second timer

  useEffect(() => {
    // 1. Start the countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 2. Redirect when the timer hits 0
    const redirect = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    // Cleanup timers if the user leaves the page early
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="mb-6 bg-emerald-50 p-4 rounded-full">
        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
      </div>

      <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
        Account Created!
      </h1>

      <p className="text-slate-500 font-medium max-w-sm mb-8">
        Please check your email to verify your account. We are preparing your
        dashboard now.
      </p>

      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Redirecting to Dashboard in {countdown}s...
        </p>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-8 text-xs font-bold text-blue-600 hover:underline"
      >
        Click here if you aren't redirected automatically
      </button>
    </div>
  );
}
