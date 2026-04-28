"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  BookOpen,
  TrendingUp,
  CalendarDays,
  Loader2,
  Download,
  Sparkles,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Award,
  BarChart,
} from "lucide-react";
import CompleteProfile from "../complete-profile/page";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function StudentDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          if (typeof window !== "undefined")
            window.location.href = "/auth/login";
          return;
        }

        const [{ data: profileData }, { data: resultsData }] =
          await Promise.all([
            supabase
              .from("profiles")
              .select(`*, classes (name)`)
              .eq("id", user.id)
              .single(),
            supabase
              .from("results")
              .select("*")
              .eq("student_id", user.id)
              .eq("status", "published")
              .order("subject_name", { ascending: true }),
          ]);

        if (isMounted) {
          setProfile(profileData);
          setResults(resultsData || []);
        }
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const stats = useMemo(() => {
    if (results.length === 0) return { average: 0, count: 0 };
    const total = results.reduce(
      (acc, res) => acc + (Number(res.total_score) || 0),
      0,
    );
    return {
      average: parseFloat((total / results.length).toFixed(1)),
      count: results.length,
    };
  }, [results]);

  const getPrincipalRemark = (avg: number) => {
    if (avg >= 75)
      return "An outstanding performance. Keep maintaining this standard of excellence.";
    if (avg >= 60)
      return "A very good result. With more effort in your core subjects, you can reach the top.";
    if (avg >= 50)
      return "A fair performance. You are encouraged to put in more study hours to improve your grades.";
    return "Result is below average. Please meet with the counselor to discuss a dedicated study plan.";
  };

  const getBase64Image = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) return null;
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Asset failed to load:", url);
      return null;
    }
  };

  const downloadReportCard = async () => {
    if (typeof window === "undefined" || !profile) return;
    setIsDownloading(true);

    try {
      const doc = new jsPDF();

      const logoUrl =
        "https://hhwfhhenlhngkhaetgje.supabase.co/storage/v1/object/public/assets/Luckyschool.png";
      const stampUrl =
        "https://hhwfhhenlhngkhaetgje.supabase.co/storage/v1/object/public/assets/signed_new.png";

      const [logoBase64, stampBase64] = await Promise.all([
        getBase64Image(logoUrl),
        getBase64Image(stampUrl),
      ]);

      doc.setDrawColor(22, 101, 52);
      doc.setLineWidth(0.8);
      doc.rect(5, 5, 200, 287);

      if (logoBase64) doc.addImage(logoBase64, "PNG", 12, 12, 28, 28);

      doc.setFontSize(22);
      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "bold");
      doc.text("LUCKY INTERNATIONAL SCHOOLS", 45, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text("OFFICIAL PROGRESS REPORT • 2025/2026 SESSION", 45, 28);

      doc.setFillColor(245, 247, 250);
      doc.rect(14, 45, 182, 32, "F");
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.text(
        `STUDENT: ${profile?.first_name || ""} ${profile?.last_name || ""}`.toUpperCase(),
        20,
        56,
      );
      doc.text(`CLASS: ${profile?.classes?.name || "SSS3"}`, 20, 66);
      doc.text(`AVG SCORE: ${stats?.average || 0}%`, 130, 56);
      doc.text(
        `STUDENT ID: ${profile?.id ? profile.id.substring(0, 8).toUpperCase() : "N/A"}`,
        130,
        66,
      );

      // Try using the plugin method on doc, fallback to the imported function
      if (typeof (doc as any).autoTable === "function") {
        (doc as any).autoTable({
          startY: 82,
          head: [
            [
              "S/N",
              "SUBJECT",
              "CA (40%)",
              "EXAM (60%)",
              "TOTAL",
              "GRADE",
              "AVG",
              "POS",
            ],
          ],
          body: results.map((res: any, i: number) => [
            i + 1,
            res.subject_name?.toUpperCase() || "N/A",
            res.ca_score || "0",
            res.exam_score || "0",
            res.total_score || "0",
            res.grade || "N/A",
            res.class_avg || "N/A",
            res.subject_pos || "N/A",
          ]),
          headStyles: { fillColor: [22, 101, 52], fontSize: 8, halign: "center" },
          styles: { fontSize: 8, cellPadding: 4 },
          theme: "grid",
        });
      } else if (typeof autoTable === "function") {
        autoTable(doc, {
          startY: 82,
          head: [
            [
              "S/N",
              "SUBJECT",
              "CA (40%)",
              "EXAM (60%)",
              "TOTAL",
              "GRADE",
              "AVG",
              "POS",
            ],
          ],
          body: results.map((res: any, i: number) => [
            i + 1,
            res.subject_name?.toUpperCase() || "N/A",
            res.ca_score || "0",
            res.exam_score || "0",
            res.total_score || "0",
            res.grade || "N/A",
            res.class_avg || "N/A",
            res.subject_pos || "N/A",
          ]),
          headStyles: { fillColor: [22, 101, 52], fontSize: 8, halign: "center" },
          styles: { fontSize: 8, cellPadding: 4 },
          theme: "grid",
        });
      }

      const finalY = ((doc as any).lastAutoTable?.finalY || 150) + 15;

      doc.setFontSize(10);
      doc.setTextColor(50);
      doc.setFont("helvetica", "bold");

      doc.text("PRINCIPAL'S REMARK:", 14, finalY);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text(getPrincipalRemark(stats?.average || 0), 14, finalY + 6);

      if (stampBase64)
        doc.addImage(stampBase64, "PNG", 145, finalY + 5, 35, 35);

      doc.setDrawColor(200);
      doc.line(140, finalY + 40, 195, finalY + 40);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      doc.text("Abah O. Lucky", 153, finalY + 45);
      doc.setFontSize(8);
      doc.text("SCHOOL PRINCIPAL", 152, finalY + 49);

      doc.save(`${profile?.first_name}_Report_Card.pdf`);
    } catch (error: any) {
      console.error("PDF Error:", error);
      alert(
        "There was an issue generating your document: " +
          (error?.stack || error?.message || "Unknown error"),
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-10 bg-[#FAF9F6] selection:text-indigo-900 overflow-x-hidden">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-4" />
        <span className="text-xs font-medium text-slate-400 tracking-[0.2em] uppercase">
          Constructing Experience
        </span>
      </div>
    );
  }

  if (!profile?.first_name) {
    return <CompleteProfile />;
  }

  return (
    <div className="min-h-full w-full bg-[#FAF9F6] font-sans selection:bg-indigo-200 relative selection:text-indigo-900 overflow-x-hidden">
      {/* Background Ambience fixed behind everything */}
      <div className="fixed top-[-10%] left-0 w-[40vw] h-[40vw] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] bg-rose-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Main Content Spatial Layout */}
      <div className="relative z-10 w-full p-4 md:p-8 xl:p-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 max-w-[1600px] mx-auto w-full">
          {/* Left Column: Feed & Primary Data */}
          <div className="flex flex-col gap-8 w-full">
            {/* Hero Masthead */}
            <motion.header
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="w-full flex justify-between items-end p-2"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 backdrop-blur-md mb-6 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-600">
                    Student Portal
                  </span>
                </motion.div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-slate-800 tracking-[-0.04em] leading-[1.05]">
                  Hello,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-400">
                    {profile?.first_name}
                  </span>
                  .
                </h1>
                <p className="text-base md:text-lg text-slate-500 mt-4 md:mt-6 font-medium max-w-xl">
                  Here is your academic overview for {profile?.classes?.name}.
                  You're currently performing in the top 15% of your cohort.
                  Keep it up!
                </p>
              </div>
            </motion.header>

            {/* Majestic Stats Bento Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <CustomStatCard
                title="Grade Average"
                value={`${stats.average}%`}
                trend="+2.4%"
                color="indigo"
                icon={TrendingUp}
                colSpan="md:col-span-1"
              />
              <CustomStatCard
                title="Enrolled Subjects"
                value={results.length.toString()}
                trend="Current"
                color="rose"
                icon={BookOpen}
                colSpan="md:col-span-1"
              />
              <CustomStatCard
                title="Term Attendance"
                value="98%"
                trend="Perfect"
                color="amber"
                icon={CalendarDays}
                colSpan="md:col-span-1"
              />
            </motion.div>

            {/* Grand Table Layout */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)] w-full min-h-[400px]"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Academic Records
                </h2>
                <div className="flex bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm gap-2 mt-4 md:mt-0">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    className="bg-transparent border-none outline-none text-xs w-24 md:w-32 placeholder:text-slate-400 text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {results.length > 0 ? (
                  results.map((res, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i}
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white/80 hover:bg-white border border-slate-100 hover:border-indigo-100 transition-all duration-300 rounded-[1.5rem] md:rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer gap-4 md:gap-0"
                    >
                      <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[1.2rem] bg-gradient-to-tr from-slate-100 to-white flex items-center justify-center shadow-inner text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                          <Award className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">
                            {res.subject_name}
                          </h3>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                            Class Pos: {res.subject_pos || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between md:justify-end items-center gap-6 md:gap-8 w-full md:w-auto md:pr-4">
                        <div className="text-left md:text-right">
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Total Score
                          </p>
                          <p className="text-lg md:text-xl font-black text-slate-700">
                            {res.total_score}
                          </p>
                        </div>
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-[1rem] font-black text-base md:text-lg shrink-0
                               ${
                                 res.grade === "A"
                                   ? "bg-indigo-100 text-indigo-700"
                                   : res.grade === "B"
                                     ? "bg-emerald-100 text-emerald-700"
                                     : "bg-rose-100 text-rose-700"
                               }`}
                        >
                          {res.grade || "N/A"}
                        </div>
                        <div className="hidden md:flex w-8 h-8 rounded-full border border-slate-200 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 opacity-50">
                    <BarChart className="w-8 h-8 text-slate-400 mb-4" />
                    <p className="text-xs font-bold tracking-widest uppercase">
                      No Records Available
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Profile & Actions Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 h-full w-full"
          >
            {/* Profile Ultra-Card */}
            <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-[120px] bg-gradient-to-br from-indigo-200 via-purple-200 to-rose-200 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

              <div className="relative mt-8 mb-6">
                <div className="w-28 h-28 rounded-full bg-white p-2 shadow-2xl shadow-indigo-100 relative z-10">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                    {profile?.avatar_url || profile?.profile_image_url || profile?.image_url ? (
                      <img 
                        src={
                          ((profile?.avatar_url || profile?.profile_image_url || profile?.image_url) as string).startsWith('http') 
                          ? (profile?.avatar_url || profile?.profile_image_url || profile?.image_url) 
                          : supabase.storage.from("avatars").getPublicUrl(profile?.avatar_url || profile?.profile_image_url || profile?.image_url).data.publicUrl
                        } 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 right-0 w-8 h-8 bg-emerald-400 border-4 border-white rounded-full z-20 shadow-sm" />
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 mb-8">
                ID: {profile?.id?.substring(0, 8)}
              </p>

              <button
                onClick={downloadReportCard}
                disabled={isDownloading}
                className="w-full py-4 rounded-[1.5rem] bg-slate-900 text-white font-bold text-sm tracking-wide shadow-xl shadow-slate-900/20 hover:bg-indigo-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
              >
                {isDownloading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download className="w-4 h-4" /> Download Result</>
                )}
              </button>
            </div>

            {/* Mini Notice Board Element */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 rounded-[3rem] shadow-xl shadow-indigo-500/20 text-white flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-200 mb-6 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Upcoming
              </h3>

              <div className="flex gap-4 items-start relative z-10 w-full">
                <div className="w-14 h-14 bg-white/20 rounded-[1.2rem] flex flex-col items-center justify-center backdrop-blur-md border border-white/30 shrink-0">
                  <span className="text-[9px] uppercase font-black text-indigo-100 leading-none">
                    Nov
                  </span>
                  <span className="text-lg font-black leading-none mt-1">
                    24
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">Final Examinations</p>
                  <p className="text-xs text-indigo-100/80 font-medium leading-relaxed">
                    Ensure all continuous assessments are reviewed prior.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/50 backdrop-blur-xl border border-white rounded-[3rem] shadow-sm flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-600 tracking-wide">
                System Preferences
              </p>
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest max-w-[150px]">
                Manage your account details & security.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CustomStatCard({
  title,
  value,
  trend,
  color,
  icon: Icon,
  colSpan,
}: any) {
  const variants: any = {
    indigo: "bg-[#EEF2FC] text-indigo-600 border-indigo-100/50",
    rose: "bg-[#FEF1F2] text-rose-600 border-rose-100/50",
    amber: "bg-[#FEF7EB] text-amber-600 border-amber-100/50",
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
      }}
      className={`bg-white/60 backdrop-blur-xl border border-white/80 p-4 md:p-5 lg:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between ${colSpan}`}
    >
      <div className="flex justify-between items-start mb-6 md:mb-8 gap-2 flex-wrap">
        <div
          className={`p-2 md:p-3 lg:p-4 rounded-xl md:rounded-[1.2rem] ${variants[color]} group-hover:scale-110 transition-transform duration-500 shrink-0`}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </div>
        <span className="inline-block px-2 lg:px-3 py-1 bg-white border border-slate-100 rounded-full text-[7px] md:text-[8px] lg:text-[9px] font-black uppercase text-slate-500 tracking-wider break-all max-w-full text-center">
          {trend}
        </span>
      </div>

      <div>
        <p className="text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1 lg:mb-2 leading-snug">
          {title}
        </p>
        <p className="text-2xl md:text-3xl 2xl:text-4xl font-black text-slate-800 tracking-[-0.05em] break-words">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
