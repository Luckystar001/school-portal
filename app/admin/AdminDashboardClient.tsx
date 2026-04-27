"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, GraduationCap, BookOpen, BarChart3, Settings, Database, Activity,
  LayoutDashboard, Server, Shield, Bell, ChevronRight, UserCircle
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function AdminDashboardClient({ stats }: { stats: any[] }) {
  const statIcons: Record<string, React.ElementType> = {
    Users,
    GraduationCap,
    BarChart3,
    BookOpen,
  };

  const statColors: Record<string, string> = {
    "Total Students": "indigo",
    "Staff Members": "emerald",
    "Results Entered": "amber",
    "Total Profiles": "rose",
  };

  return (
    <div className="min-h-full w-full bg-[#FAF9F6] font-sans selection:bg-indigo-200 relative selection:text-indigo-900 overflow-x-hidden">
      
      {/* Background Ambience fixed behind everything */}
      <div className="fixed top-[-10%] left-[0] w-[40vw] h-[40vw] bg-violet-200/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Main Content Spatial Layout */}
      <div className="relative z-10 w-full p-4 md:p-8 xl:p-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8 max-w-[1600px] mx-auto w-full">
          
          {/* Left Column: Data Grid */}
          <div className="flex flex-col gap-8 w-full">
            
            {/* Masthead */}
            <motion.header 
               initial="hidden" animate="visible" variants={fadeUp}
               className="w-full flex justify-between items-end p-2"
            >
               <div>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 backdrop-blur-md mb-6 shadow-sm">
                     <Shield className="w-4 h-4 text-slate-800" />
                     <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-600">Administration Console</span>
                  </motion.div>
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-slate-800 tracking-[-0.04em] leading-[1.05]">
                     System <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">Overview</span>.
                  </h1>
                  <p className="text-base md:text-lg text-slate-500 mt-4 md:mt-6 font-medium max-w-xl">
                     Command center for structural integrity. Monitor user metrics, adjust configurations, and control access nodes.
                  </p>
               </div>
            </motion.header>

            {/* Core Metrics Bento Grid */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 gap-4">
               {stats.map((stat, idx) => {
                  const Icon = statIcons[stat.iconName] || Users;
                  return (
                     <CustomStatCard 
                        key={idx}
                        title={stat.title} 
                        value={stat.value} 
                        trend={stat.description} 
                        color={statColors[stat.title] || "indigo"} 
                        icon={Icon} 
                        colSpan="col-span-1" 
                     />
                  );
               })}
            </motion.div>

            {/* Quick Actions Control Panel */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)] w-full min-h-[400px]">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Access Domains</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Student Roster", path: "/admin/students", desc: "Manage all student accounts & enrollment records.", icon: GraduationCap, color: "bg-[#EEF2FC] text-indigo-600", hover: "hover:border-indigo-200" },
                    { title: "Staff Directory", path: "/admin/staff", desc: "Modify faculty permissions and departments.", icon: Users, color: "bg-[#FEF7EB] text-amber-600", hover: "hover:border-amber-200" },
                    { title: "Academic Results", path: "/staff/results", desc: "Oversee grading structure and report publications.", icon: BookOpen, color: "bg-[#E6F7F1] text-emerald-600", hover: "hover:border-emerald-200" },
                    { title: "System Configuration", path: "/admin/settings", desc: "Global variables, security, and aesthetics.", icon: Settings, color: "bg-slate-100 text-slate-600", hover: "hover:border-slate-300" },
                  ].map((action, idx) => (
                     <Link
                       key={idx}
                       href={action.path}
                       className={`group block p-6 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 hover:bg-white hover:shadow-md hover:-translate-y-1 ${action.hover}`}
                     >
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[1.2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${action.color}`}>
                           <action.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight mb-1 md:mb-2">{action.title}</h3>
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed">{action.desc}</p>
                     </Link>
                  ))}
               </div>
            </motion.div>
          </div>

          {/* Right Column: Infrastructure & Operations Widget */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden xl:flex flex-col gap-6 h-full w-full">
             
             {/* Infrastructure Node Card */}
             <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl shadow-slate-900/10 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay" />
                <div className="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] bg-indigo-500/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="w-full flex justify-between items-center mb-8 relative z-10 px-4">
                   <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Node Status</span>
                   <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>
                
                <div className="relative mb-6">
                   <div className="w-28 h-28 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner relative z-10">
                      <Database className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                   </div>
                </div>

                <h2 className="text-2xl font-black text-white tracking-tight">Supabase Main</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 mb-8">
                   Database Connected
                </p>

                <div className="w-full space-y-3 relative z-10">
                   <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                         <Activity className="w-4 h-4 text-blue-400" />
                         <span className="text-xs font-bold text-slate-300">Auth GoTrue</span>
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Healthy</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                         <Server className="w-4 h-4 text-purple-400" />
                         <span className="text-xs font-bold text-slate-300">Storage Bucket</span>
                      </div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Healthy</span>
                   </div>
                </div>
             </div>

             {/* Security Feed */}
             <div className="flex-1 bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-sm flex flex-col relative overflow-hidden">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-2">
                   <Bell className="w-4 h-4" /> Activity Logs
                 </h3>
                 
                 <div className="space-y-4">
                    {[
                       { user: "Sarah L.", role: "Staff", action: "Updated Grades", time: "2 min ago" },
                       { user: "Admin", role: "System", action: "Modified Settings", time: "1 hr ago" },
                       { user: "John D.", role: "Student", action: "Profile Login", time: "3 hr ago" },
                    ].map((log, i) => (
                       <div key={i} className="flex gap-4 items-center bg-white border border-slate-100 p-3 rounded-[1.5rem] shadow-sm">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                             <UserCircle className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] md:text-xs font-black text-slate-800"><span className="text-indigo-600">{log.user}</span> {log.action}</p>
                             <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{log.role} • {log.time}</p>
                          </div>
                       </div>
                    ))}
                 </div>
             </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CustomStatCard({ title, value, trend, color, icon: Icon, colSpan }: any) {
   const variants: any = {
      indigo: "bg-[#EEF2FC] text-indigo-600 border-indigo-100/50",
      emerald: "bg-[#E6F7F1] text-emerald-600 border-emerald-100/50",
      amber: "bg-[#FEF7EB] text-amber-600 border-amber-100/50",
      rose: "bg-[#FEF1F2] text-rose-600 border-rose-100/50"
   };
   
   return (
      <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} 
         className={`bg-white/60 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${colSpan}`}
      >
         <div className="flex justify-between items-start mb-8 md:mb-12">
            <div className={`p-3 md:p-4 rounded-xl md:rounded-[1.5rem] ${variants[color] || variants.indigo} group-hover:scale-110 transition-transform duration-500`}>
               <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="inline-block px-2 md:px-3 py-1 bg-white border border-slate-100 rounded-full text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest max-w-[80px] md:max-w-none truncate">
               Info
            </span>
         </div>
         
         <div>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 md:mb-2 truncate pr-4">{title}</p>
            <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-[-0.05em]">{value}</p>
            <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-2 truncate bg-white/50 border border-slate-100 w-fit px-2 py-1 rounded-full">{trend}</p>
         </div>
      </motion.div>
   );
}
