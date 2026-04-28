"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  GraduationCap,
  User as UserIcon,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Results",
    href: "/dashboard/results",
    icon: BarChart3,
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserIcon,
  },
  {
    label: "Classes",
    href: "/dashboard/classes",
    icon: GraduationCap,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const logoUrl =
    "https://hhwfhhenlhngkhaetgje.supabase.co/storage/v1/object/public/assets/Luckyschool.png";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Menu Button - Uniform with Staff/Admin */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Container - Now using Slate-950 for uniformity */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-64 h-screen bg-slate-950 text-slate-200 flex flex-col transition-transform duration-300 z-40 shadow-2xl border-r border-white/5`}
      >
        {/* Top Section: Official Logo Branding */}
        <div className="p-6 border-b border-white/5 mt-16 md:mt-0 flex-none bg-white/5">
          <Link
            href="/"
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner transition-transform group-hover:scale-105">
              <img
                src={logoUrl}
                alt="Lucky International School Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <span className="block font-black text-xs uppercase tracking-tighter text-white leading-none">
                Lucky International
              </span>
              <span className="block font-bold text-[9px] uppercase tracking-[0.3em] text-blue-500 mt-1">
                Student Portal
              </span>
            </div>
          </Link>
        </div>

        {/* User Info Card - Uniform with Staff/Admin */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
            <UserCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">
              Active Student
            </p>
            <p className="font-bold text-xs truncate text-slate-200">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 mt-2 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-blue-500/60"}`}
                />
                <span className="font-bold text-xs uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/5 flex-none bg-slate-950">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 font-bold text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
