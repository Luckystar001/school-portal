"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import CompleteProfile from "../complete-profile/page";

// FORCE the dashboard client to only load on the browser (ssr: false)
const StudentDashboardClient = dynamic(
  () => import("./StudentDashboardClient"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function DashboardPage() {
  return <StudentDashboardClient />;
}
