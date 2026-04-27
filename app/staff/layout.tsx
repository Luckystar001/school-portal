import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StaffSidebar } from "@/components/StaffSidebar";

export default async function StaffLayout({
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, user_type, id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.user_type !== "staff") {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-[#FAF9F6] selection:bg-indigo-200 overflow-hidden font-sans">
      <StaffSidebar profile={profile} />
      <main className="flex-1 flex flex-col relative overflow-y-auto selection:text-indigo-900 overflow-x-hidden">
         {/* Universal Hyper-Custom Background Elements mapping to the view pane */}
         <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-sky-200/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
         <div className="absolute bottom-[0%] right-[0%] w-[50vw] h-[50vw] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
         
         <div className="relative z-10 w-full h-full">
            {children}
         </div>
      </main>
    </div>
  );
}
