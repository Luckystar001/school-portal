"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  FlaskConical,
  Languages,
  Globe2,
  Cpu,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Staff() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);

  const staffMembers = [
    {
      name: "Engr. Abah Oche Lucky",
      title: "Principal",
      dept: "Administration",
      bio: "PhD in Education, 20+ years of educational leadership experience.",
    },
    {
      name: "Mrs. Margaret Okafor",
      title: "Vice Principal",
      dept: "Administration",
      bio: "M.Ed in School Management, dedicated to student welfare.",
    },
    {
      name: "Prof. James Udoh",
      title: "Head of Science",
      dept: "Science",
      bio: "BSc & MSc Physics, leading international research initiatives.",
    },
    {
      name: "Dr. Patricia Amoo",
      title: "Head of English",
      dept: "Languages",
      bio: "PhD in Literature, expert in global curriculum development.",
    },
    {
      name: "Mr. David Chen",
      title: "Head of Mathematics",
      dept: "Mathematics",
      bio: "MSc Mathematics, passionate about advanced STEM education.",
    },
    {
      name: "Mrs. Zainab Hassan",
      title: "Head of Social Sciences",
      dept: "Humanities",
      bio: "MA in History, specialized in global perspectives.",
    },
    {
      name: "Mr. Emmanuel Eze",
      title: "Head of ICT",
      dept: "Technology",
      bio: "BSc Computer Science, advocate for digital literacy.",
    },
    {
      name: "Ms. Fatima Al-Rashid",
      title: "School Counselor",
      dept: "Welfare",
      bio: "MA in Psychology, supporting student mental health.",
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#F2C12E]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
              The Faculty of Excellence
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.8] tracking-tighter mb-8">
            OUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#F2C12E] to-blue-600">
              FACULTY.
            </span>
          </h1>
          <p className="text-base md:text-xl text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Meet the architects of the future—a team of world-class educators
            and administrators dedicated to nurturing greatness.
          </p>
        </div>
      </section>

      {/* --- STAFF DIRECTORY --- */}
      <section className="py-20 bg-white relative -mt-12 rounded-t-[3.5rem] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Leadership & Faculty
              </h2>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
              Directory List 2026
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          >
            {staffMembers.map((member, idx) => (
              <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -5 }}>
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] h-full transition-all group hover:bg-slate-900">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-black text-slate-950 group-hover:text-white transition-colors tracking-tight">
                      {member.name}
                    </CardTitle>
                    <p className="text-[10px] font-black uppercase text-blue-600 group-hover:text-[#F2C12E] tracking-widest">
                      {member.title}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-10">
                    <p className="text-[9px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full w-fit font-black uppercase group-hover:bg-white/10 group-hover:text-white">
                      {member.dept}
                    </p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-400">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Departments Section: The Bento Grid */}
          <div className="bg-slate-950 p-10 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Users size={200} />
            </div>
            <h3 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter">
              Our Departments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                {
                  title: "Science & Maths",
                  icon: FlaskConical,
                  desc: "A hub of empirical research and logical inquiry, leading the way in STEM subjects.",
                },
                {
                  title: "Languages",
                  icon: Languages,
                  desc: "Fostering global communication skills and deep cultural appreciation through literature.",
                },
                {
                  title: "Humanities",
                  icon: Globe2,
                  desc: "Preparing socially responsible citizens with a global awareness and historical perspective.",
                },
                {
                  title: "Technology",
                  icon: Cpu,
                  desc: "Equipping students with 21st-century digital literacy and innovative problem-solving skills.",
                },
                {
                  title: "Welfare",
                  icon: HeartHandshake,
                  desc: "Dedicated counseling and support ensuring every student's mental well-being.",
                },
                {
                  title: "Leadership",
                  icon: ShieldCheck,
                  desc: "Elite administrative governance ensuring the standard of excellence is always met.",
                },
              ].map((dept, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#F2C12E] group-hover:bg-[#F2C12E] group-hover:text-slate-950 transition-all">
                    <dept.icon size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-[0.2em]">
                      {dept.title}
                    </h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      {dept.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
