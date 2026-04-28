"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  Users, ClipboardCheck, BookOpen, Clock, UserCircle, Loader2,
  CalendarDays, LayoutDashboard, Settings, Edit3, MessageSquare, PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffSidebar } from "@/components/StaffSidebar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function StaffDashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [resultsCount, setResultsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const [
          { data: profileData },
          { data: assignments },
          { count: rCount }
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("first_name, last_name, user_type, id")
            .eq("id", user.id)
            .single(),
          supabase
            .from("courses")
            .select("class_id, subject_id")
            .eq("staff_id", user.id),
          supabase
            .from("results")
            .select("*", { count: "exact", head: true })
            .eq("staff_id", user.id)
        ]);

        if (profileData?.user_type === "student") {
          router.push("/dashboard");
          return;
        }
        setProfile(profileData);
        setResultsCount(rCount || 0);

        if (assignments && assignments.length > 0) {
          setSubjectCount(assignments.length);
          const classIds = Array.from(new Set(assignments.map((a) => a.class_id)));

          const { count: sCount } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("user_type", "student")
            .in("class_id", classIds);
          setStudentCount(sCount || 0);
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#FAFAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-4" />
        <span className="text-xs font-medium text-slate-400 tracking-[0.2em] uppercase">Authenticating Faculty</span>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full p-4 md:p-8 xl:p-12 overflow-y-auto overflow-x-hidden h-full">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 max-w-[1600px] mx-auto w-full">
        {/* Left Column: Primary Interface */}
              <div className="flex flex-col gap-8 w-full">
                
                {/* Masthead */}
                <motion.header 
                  initial="hidden" animate="visible" variants={fadeUp}
                  className="w-full flex justify-between items-end p-2"
                >
                  <div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 backdrop-blur-md mb-6 shadow-sm">
                       <Edit3 className="w-4 h-4 text-indigo-500" />
                       <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-600">Faculty Suite</span>
                    </motion.div>
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-slate-800 tracking-[-0.04em] leading-[1.05]">
                      Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">{profile?.first_name}</span>.
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 mt-4 md:mt-6 font-medium max-w-xl">
                      Here are your active classes and recent activity. You are shaping the next generation.
                    </p>
                  </div>
                </motion.header>

                {/* Stats Bento Grid */}
                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   <CustomStatCard title="My Students" value={studentCount.toString()} trend="Active Cohort" color="indigo" icon={Users} colSpan="col-span-1 md:col-span-1" />
                   <CustomStatCard title="Subjects" value={subjectCount.toString()} trend="Assigned" color="sky" icon={BookOpen} colSpan="col-span-1 md:col-span-1" />
                   <CustomStatCard title="Uploads" value={resultsCount.toString()} trend="Graded" color="emerald" icon={ClipboardCheck} colSpan="col-span-1 md:col-span-1" />
                </motion.div>

                 {/* Grand Teaching Tools Layout */}
                 <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)] w-full min-h-[400px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                       <h2 className="text-2xl font-black text-slate-800 tracking-tight">Essential Toolkit</h2>
                       <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-[1.2rem] text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform mt-4 md:mt-0 w-full md:w-auto justify-center">
                          <PlusCircle className="w-4 h-4" /> New Record
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Link href="/staff/results" className="group p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16" />
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md mb-6 md:mb-8 group-hover:scale-110 transition-transform shadow-inner">
                             <ClipboardCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black tracking-tight mb-2">Grade Portal</h3>
                          <p className="text-[9px] md:text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Input & publish scores.</p>
                       </Link>
                       
                       <Link href="/staff/students" className="group p-6 md:p-8 rounded-[2rem] bg-white/80 backdrop-blur-sm border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:bg-white hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full blur-2xl -mr-16 -mt-16 opacity-50 transition-opacity group-hover:opacity-100" />
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-100 border border-slate-200 rounded-[1.5rem] flex items-center justify-center mb-6 md:mb-8 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                             <Users className="w-6 h-6 md:w-8 md:h-8 text-slate-600 group-hover:text-indigo-600" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-2">My Roster</h3>
                          <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Manage class populations.</p>
                       </Link>
                    </div>
                 </motion.div>
              </div>

              {/* Right Column: Communication Widget */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden xl:flex flex-col gap-6 h-full w-full">
                 
                 {/* Profile Ultra-Card */}
                 <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-[120px] bg-gradient-to-br from-blue-200 via-indigo-200 to-sky-200 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                    
                    <div className="relative mt-8 mb-6">
                       <div className="w-28 h-28 rounded-full bg-white p-2 shadow-2xl shadow-indigo-100 relative z-10">
                          <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                             <UserCircle className="w-10 h-10 text-slate-400" />
                          </div>
                       </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profile?.first_name} {profile?.last_name}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 mb-8">
                       STAFF ID: {profile?.id?.substring(0, 8)}
                    </p>

                    <button className="w-full py-4 rounded-[1.5rem] bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2 border border-indigo-100">
                       View Directory
                    </button>
                 </div>

                 {/* Notice Board */}
                 <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden">
                     <div className="w-full h-1.5 bg-gradient-to-r from-indigo-400 to-sky-400 absolute top-0 left-0" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-2">
                       <CalendarDays className="w-4 h-4" /> Bulletins
                     </h3>
                     
                     <div className="flex gap-4 items-center bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-sm">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex flex-col items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                           <span className="text-[8px] md:text-[9px] uppercase font-black tracking-wider leading-none">Due</span>
                           <span className="text-sm md:text-base font-black leading-none mt-1">15</span>
                        </div>
                        <div>
                           <p className="text-xs md:text-sm font-black text-slate-800">Submit CA Scores</p>
                           <p className="text-[9px] md:text-[10px] text-slate-400 font-bold tracking-wide mt-1">Mandatory submission cut-off.</p>
                        </div>
                     </div>
                 </div>

              </motion.div>
           </div>
        </div>
  );
}

function CustomStatCard({ title, value, trend, color, icon: Icon, colSpan }: any) {
   const variants: any = {
      indigo: "bg-[#EEF2FC] text-indigo-600 border-indigo-100/50",
      sky: "bg-[#E0F2FE] text-sky-600 border-sky-100/50",
      emerald: "bg-[#E6F7F1] text-emerald-600 border-emerald-100/50"
   };
   
   return (
      <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} 
         className={`bg-white/60 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${colSpan}`}
      >
         <div className="flex justify-between items-start mb-8 md:mb-12">
            <div className={`p-3 md:p-4 rounded-xl md:rounded-[1.5rem] ${variants[color] || variants.indigo} group-hover:scale-110 transition-transform duration-500`}>
               <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="inline-block px-2 md:px-3 py-1 bg-white border border-slate-100 rounded-full text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest max-w-[80px] md:max-w-none truncate">
               {trend}
            </span>
         </div>
         
         <div>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2 truncate pr-4">{title}</p>
            <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-[-0.05em]">{value}</p>
         </div>
      </motion.div>
   );
}
