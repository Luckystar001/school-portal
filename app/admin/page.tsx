import { createClient } from "@/lib/supabase/server";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch Statistics from the unified Profiles table
  const [
    { count: studentCount },
    { count: staffCount },
    { count: resultsCount },
    { count: profileCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("user_type", "student"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("user_type", "staff"),
    supabase.from("results").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      title: "Total Students",
      value: studentCount || 0,
      iconName: "GraduationCap",
      description: "Active student accounts",
    },
    {
      title: "Staff Members",
      value: staffCount || 0,
      iconName: "Users",
      description: "Teachers and staff",
    },
    {
      title: "Results Entered",
      value: resultsCount || 0,
      iconName: "BarChart3",
      description: "Total result records",
    },
    {
      title: "Total Profiles",
      value: profileCount || 0,
      iconName: "BookOpen",
      description: "User accounts",
    },
  ];

  return <AdminDashboardClient stats={stats} />;
}
