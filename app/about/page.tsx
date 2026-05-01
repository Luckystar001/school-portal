"use client";
export const dynamic = "force-dynamic";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Award,
  Trophy,
  Sparkles,
  History,
  GraduationCap,
} from "lucide-react";

export default function About() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* --- HERO SECTION: COMPACT & CINEMATIC --- */}
      <section className="relative overflow-hidden bg-slate-950 pt-24 pb-20 md:pt-32 md:pb-32 z-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y: yBg }}
            className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"
          />
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-[#F2C12E]/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F2C12E]" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400">
              The Lucky Standard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white leading-[0.8] tracking-tighter mb-6"
          >
            OUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#F2C12E] to-blue-600">
              LEGACY.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-slate-400 max-w-xl mx-auto font-medium leading-relaxed"
          >
            Nurturing excellence since 1990. We are more than a school; we are a
            sanctuary where legends are crafted.
          </motion.p>
        </div>
      </section>

      {/* --- OUR STORY: TIGHT ALIGNMENT --- */}
      <section className="py-20 bg-white relative -mt-12 rounded-t-[3rem] z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                <History className="w-3 h-3" /> Our Journey
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Three Decades of <br /> Shaping Destinies
              </h2>
              <div className="space-y-4 text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                <p>
                  Founded in 1990, Lucky International Schools has been a beacon
                  of educational excellence for over 30 years. What began as a
                  vision has grown into a prestigious institution known for
                  character and academic rigor.
                </p>
                <p>
                  Our commitment to holistic development shapes students into
                  global leaders who succeed in every field.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-2xl border border-slate-50">
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">
                    2.5k+
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Graduates
                  </p>
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl">
                  <p className="text-3xl font-black text-[#F2C12E] tracking-tighter">
                    34
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Years Exp
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- MISSION, VISION, VALUES: COMPACT BENTO --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Our Mission",
                icon: Target,
                text: "To provide quality, accessible education that develops academically excellent and morally upright citizens.",
              },
              {
                title: "Our Vision",
                icon: Eye,
                text: "To be a world-class institution producing intellectually sharp and globally competitive leaders.",
              },
              {
                title: "Our Values",
                icon: Heart,
                text: "Integrity, Excellence, Innovation, Teamwork, and Respect define our character.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none shadow-lg rounded-[2rem] h-full transition-all hover:-translate-y-1">
                  <CardHeader className="pt-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tighter">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ACHIEVEMENTS --- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12 tracking-tighter">
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-slate-950 p-10 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative group"
            >
              <Award
                className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"
                size={120}
              />
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <GraduationCap className="text-blue-400" /> Academic Prowess
              </h3>
              <ul className="space-y-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <li className="flex items-center gap-3">
                  <span className="text-[#F2C12E]">✓</span> 98% Pass Rate
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F2C12E]">✓</span> 2,500+ Distinctions
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F2C12E]">✓</span> 50+ Global Awards
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative group"
            >
              <Trophy
                className="absolute top-0 right-0 p-6 opacity-10"
                size={120}
              />
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <Sparkles /> Beyond Books
              </h3>
              <ul className="space-y-3 text-xs font-bold text-blue-100 uppercase tracking-wider">
                <li className="flex items-center gap-3">
                  <span className="text-slate-950 font-black">✓</span> Sports
                  Champions
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-slate-950 font-black">✓</span> Debate
                  Winners
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-slate-950 font-black">✓</span> Arts &
                  Culture Awards
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 py-12 border-t border-white/5 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
          &copy; 2026 Lucky International Schools. Excellence Redefined.
        </p>
      </footer>
    </div>
  );
}
