"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const logoUrl =
    "https://hhwfhhenlhngkhaetgje.supabase.co/storage/v1/object/public/assets/Luckyschool.png";

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      setIsLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24 gap-4 lg:gap-10">
          {/* --- LOGO SECTION --- */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/15 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10 transition-all group-hover:scale-105 group-active:scale-95">
                <img
                  src={logoUrl}
                  alt="Lucky International School Logo"
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
            </div>

            <div className="flex flex-col hidden sm:flex">
              <span className="font-black text-sm md:text-lg lg:text-xl uppercase tracking-tighter text-white leading-none whitespace-nowrap">
                Lucky International
              </span>
              <span className="font-bold text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-[#F2C12E] mt-1 md:mt-1.5">
                Schools
              </span>
            </div>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10 flex-shrink-0">
            {["Home", "About", "Academics", "Staff", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-[10px] xl:text-[11px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                {item}
              </Link>
            ))}
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {!isLoading && !user ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2 md:px-4"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="bg-[#F2C12E] hover:bg-white text-slate-950 font-black rounded-lg md:rounded-xl px-4 md:px-8 h-10 md:h-12 text-xs md:text-sm transition-all shadow-lg active:scale-95"
                >
                  <Link href="/auth/sign-up">Enroll</Link>
                </Button>
              </>
            ) : !isLoading && user ? (
              <div className="flex items-center gap-3 md:gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950 font-black rounded-lg md:rounded-xl h-8 md:h-12 px-3 md:px-6 text-[10px] md:text-sm"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-400 font-bold text-[10px] md:text-[11px] uppercase tracking-widest transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="w-20 md:w-24 h-8 md:h-10 bg-white/5 animate-pulse rounded-full" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
