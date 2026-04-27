import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 1. Fetch the user type using maybeSingle (removes the need for .catch)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .maybeSingle();

  // 2. Log any actual database errors for debugging
  if (profileError) {
    console.error("Auth check failed:", profileError.message);
  }

  // 3. Security Logic: If not an admin, kick them out
  if (!profile || profile.user_type !== "admin") {
    // Use the Next.js redirect function
    redirect("/dashboard");
  }

  if (!profile || profile.user_type !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
