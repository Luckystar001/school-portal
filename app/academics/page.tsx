"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Beaker,
  Palette,
  Briefcase,
  Laptop,
  Library,
  Trophy,
  Mic2,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Users, // Added the missing import
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Academics() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 80]);

  const programs = [
    {
      title: "Science Stream",
      icon: Beaker,
      description:
        "Advanced programs focusing on empirical research and mathematical logic.",
      subjects: [
        "Physics",
        "Chemistry",
        "Biology",
        "Mathematics",
        "Computer Science",
      ],
    },
    {
      title: "Arts Stream",
      icon: Palette,
      description:
        "Comprehensive humanities education covering languages and social sciences.",
      subjects: ["Literature", "History", "Geography", "Civics", "Economics"],
    },
    {
      title: "Commerce Stream",
      icon: Briefcase,
      description:
        "Business-focused curriculum preparing students for global finance.",
      subjects: [
        "Accounting",
        "Business Studies",
        "Economics",
        "Mathematics",
        "Marketing",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* --- HERO SECTION: CINEMATIC DARK --- */}
      <section className="relative overflow-hidden bg-slate-950 pt-24 pb-20 md:pt-32 md:pb-32 z-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y: yBg }}
            className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"
          />
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-[#F2C12E]/5 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 relative z-10 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#F2C12E]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
              The Pursuit of Knowledge
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.8] tracking-tighter mb-8">
            ACADEMIC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#F2C12E] to-blue-600">
              PROGRAMS.
            </span>
          </h1>
          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            A curriculum designed for legends. Combining the rigor of tradition
            with the innovation of tomorrow.
          </p>
        </motion.div>
      </section>

      {/* --- PROGRAMS SECTION --- */}
      <section className="py-20 bg-white relative -mt-12 rounded-t-[3.5rem] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          >
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] h-full transition-all hover:-translate-y-2 duration-300 overflow-hidden">
                    <CardHeader className="pt-10 bg-slate-50/50">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-blue-600">
                        <Icon size={28} />
                      </div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter">
                        {program.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 pb-10">
                      <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        {program.description}
                      </p>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                          Core Subjects
                        </h4>
                        <ul className="grid grid-cols-1 gap-3">
                          {program.subjects.map((subject, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-sm font-bold text-slate-700"
                            >
                              <CheckCircle2
                                size={16}
                                className="text-[#F2C12E]"
                              />
                              {subject}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Methodology Card */}
          <div className="bg-slate-950 p-12 md:p-20 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Lightbulb size={200} />
            </div>
            <h3 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter">
              Teaching Methodology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  title: "Student-Centered",
                  desc: "Interactive experiences that encourage critical thinking and individual creativity.",
                },
                {
                  title: "Tech Integration",
                  desc: "Digital learning tools and AI-driven insights integrated into every classroom.",
                },
                {
                  title: "Continuous Review",
                  desc: "Personalized feedback loops and assessments to ensure excellence.",
                },
                {
                  title: "Project Based",
                  desc: "Hands-on research that develops practical skills for real-world application.",
                },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-[#F2C12E] font-black text-xs uppercase tracking-[0.2em]">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FACILITIES --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              State-of-the-Art Facilities
            </h2>
            <div className="h-1.5 w-20 bg-[#F2C12E] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Science Labs",
                icon: Beaker,
                desc: "High-spec labs for specialized experiments.",
              },
              {
                title: "Computer Labs",
                icon: Laptop,
                desc: "Ultra-fast connectivity and modern hardware.",
              },
              {
                title: "The Library",
                icon: Library,
                desc: "A sanctuary of books and digital journals.",
              },
              {
                title: "Sports Complex",
                icon: Trophy,
                desc: "Football, basketball, and tennis arenas.",
              },
              {
                title: "Auditorium",
                icon: Mic2,
                desc: "Multi-purpose hall for elite performances.",
              },
              {
                title: "Learning Commons",
                icon: Users,
                desc: "Spaces designed for peer collaboration.",
              },
            ].map((facility, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }}>
                <Card className="border-none shadow-lg rounded-[2.5rem] h-full transition-all group hover:bg-slate-900">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <facility.icon size={20} />
                    </div>
                    <CardTitle className="text-lg font-black text-slate-900 group-hover:text-white transition-colors tracking-tight">
                      {facility.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
                      {facility.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 py-12 border-t border-white/5 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
          &copy; 2026 Lucky International Schools. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
