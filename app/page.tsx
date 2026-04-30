"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BookOpen,
  Users,
  Trophy,
  Globe,
  Star,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UserCircle,
  ChevronRight,
  Mail,
} from "lucide-react";

const logoUrl =
  "https://hhwfhhenlhngkhaetgje.supabase.co/storage/v1/object/public/assets/Luckyschool.png";

export default function Home() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 120]);

  const [displayText, setDisplayText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = ["Knowledge.", "Character.", "Confidence."];

  useEffect(() => {
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex <= messages[msgIndex].length) {
        setDisplayText(messages[msgIndex].substring(0, charIndex));
        charIndex++;
      } else {
        setTimeout(() => {
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [msgIndex]);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- SCROLLING TICKER --- */}
      <TopBannerTypewriter />

      {/* --- HERO SECTION 2.0 --- */}
      <section className="relative min-h-[calc(100vh-130px)] flex items-center justify-center overflow-hidden px-4 z-20 pb-16 md:pb-24">
        {/* Animated Background Container */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url('/welcome.avif')`,
              backgroundSize: "cover",
              backgroundPosition: "center 25%",
            }}
          />
          {/* Advanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/80 to-slate-950/95 mix-blend-multiply" />
          <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />

          <motion.div
            style={{ y: yBg }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 md:pt-4">
          {/* Left Column: Typography & Call to Actions */}
          <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="space-y-2 md:space-y-4 mb-6 md:mb-8 w-full">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[3rem] md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tighter"
              >
                <span className="block text-slate-300 transform hover:scale-[1.01] transition-transform origin-left">
                  BUILDING
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
                  {displayText}
                </span>
                <span className="text-[#F2C12E]">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-lg md:text-2xl text-slate-400 max-w-2xl font-medium leading-relaxed"
              >
                We don't just teach the curriculum. We architect the future
                elite leaders of the 21st century.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 md:gap-5 justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-14 md:h-16 px-8 md:px-10 shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 border-none text-xs md:text-sm lg:text-base uppercase tracking-widest"
              >
                <Link href="/auth/sign-up">
                  Start Admissions{" "}
                  <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-none bg-white text-slate-900 hover:bg-slate-200 hover:text-slate-950 font-bold rounded-2xl h-14 md:h-16 px-8 md:px-10 transition-all hover:scale-105 text-xs md:text-sm lg:text-base shadow-lg"
              >
                <Link href="/academics">Explore Curriculum</Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Floating Glassmorphic Cards Showcase */}
          <div className="lg:col-span-4 hidden lg:block relative h-full min-h-[500px]">
            {/* Top Graphic Removed */}

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-20 left-[-40px] w-[280px] bg-slate-950/80 border border-slate-800 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl"
            >
              <div className="flex -space-x-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center object-cover overflow-hidden`}
                  >
                    <UserCircle className="w-full h-full text-slate-400" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white z-10">
                  5k+
                </div>
              </div>
              <p className="text-white font-black text-base">Active Enrolled</p>
              <p className="text-slate-400 text-xs font-medium mt-1">
                Students shaping their legacy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative z-30 -mt-16 px-4 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Elite Scholars",
              val: "2.5k+",
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "University Admissions",
              val: "99.2%",
              icon: ShieldCheck,
              color: "text-emerald-500",
            },
            {
              label: "Global Accolades",
              val: "85+",
              icon: Trophy,
              color: "text-[#F2C12E]",
            },
            {
              label: "Ivy-League Educators",
              val: "150+",
              icon: Star,
              color: "text-indigo-500",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/70 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white flex flex-col items-center text-center group hover:bg-slate-900 transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none group-hover:from-slate-800" />
              <div
                className={`w-12 h-12 bg-slate-50/80 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-slate-800 transition-colors shadow-sm relative z-10 border border-slate-100 group-hover:border-slate-700`}
              >
                <s.icon
                  className={`w-6 h-6 ${s.color} group-hover:text-white transition-colors`}
                />
              </div>
              <p className="text-3xl lg:text-4xl font-black text-slate-800 group-hover:text-white tracking-tighter relative z-10 transition-colors">
                {s.val}
              </p>
              <p className="text-[9px] font-black uppercase text-slate-400 group-hover:text-blue-300 tracking-[0.25em] mt-2 relative z-10 transition-colors">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION DEMARCATION --- */}
      <div className="w-full flex items-center justify-center pt-10 pb-16 md:pt-16 md:pb-24 opacity-80 relative z-40 bg-[#FDFDFD]">
        <div className="h-[1.5px] w-[30%] md:w-1/4 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="mx-4 md:mx-6 w-3 h-3 rotate-45 border-2 border-[#F2C12E] bg-white shadow-sm" />
        <div className="h-[1.5px] w-[30%] md:w-1/4 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* --- SECONDARY SCHOOL PATHWAYS --- */}
      <section className="pb-32 bg-[#FDFDFD] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-24 space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
              The Complete <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Secondary Journey.
              </span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              From foundational junior years to intense pre-university
              preparatory programs. Discover our elite academic pillars.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* JSS */}
            <ModernSectionCard
              index="01"
              title="Junior Secondary (JSS 1-3)"
              desc="The foundational years focus on broad-based exploration. We seamlessly integrate the local curriculum with global core standards to build unshakeable competencies in Sciences, Arts, and critical thinking."
              features={[
                "Foundational Sciences",
                "Creative Arts",
                "Introduction to Coding",
                "Mentorship Programs",
              ]}
              reversed={false}
              icon={BookOpen}
              theme="blue"
              imageUrl="/jss1.jpg"
            />

            {/* SSS */}
            <ModernSectionCard
              index="02"
              title="Senior Secondary (SSS 1-3)"
              desc="Intense, laser-focused academic preparation for global exams (WAEC, NECO, IGCSE). Students select specialized pathways (Science, Arts, Commercial) guided by world-class university counselors."
              features={[
                "WAEC/IGCSE Prep",
                "University Counseling",
                "Specialized Pathways",
                "Leadership Training",
              ]}
              reversed={true}
              icon={GraduationCap}
              theme="gray"
              imageUrl="/ss3.jpeg"
            />

            {/* STEM */}
            <ModernSectionCard
              index="03"
              title="STEM & Innovation Labs"
              desc="Our state-of-the-art laboratories and robotics centers provide hands-on experience. We don't just teach theory; our students build, experiment, and engineer the technology of tomorrow."
              features={[
                "Robotics Lab",
                "AI & Machine Learning",
                "Advanced Physics",
                "Competitive Hackathons",
              ]}
              reversed={false}
              icon={Globe}
              theme="indigo"
              imageUrl="/lab.jpg"
            />

            {/* EXTRACURRICULARS */}
            <ModernSectionCard
              index="04"
              title="Sports & Extracurriculars"
              desc="A healthy body sustains a legendary mind. Beyond academics, our students engage in competitive sports, debate societies, and creative arts clubs to build well-rounded character."
              features={[
                "Competitive Athletics",
                "Debate & Model UN",
                "Orchestra & Drama",
                "Community Service",
              ]}
              reversed={true}
              icon={Trophy}
              theme="emerald"
              imageUrl="/sport.jpg"
            />
          </div>
        </div>
      </section>

      {/* --- PARALLAX ADMISSIONS HUB --- */}
      <section className="relative py-32 md:py-48 overflow-hidden text-white flex items-center justify-center min-h-[70vh] bg-slate-900">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('/Schpic.webp')] bg-cover bg-center bg-fixed"
        />
        <div className="absolute inset-0 bg-blue-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-90" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 p-8 md:p-16 rounded-[2rem] md:rounded-[3.5rem] backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-900/30"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tighter">
              Your Legacy <br />
              <span className="text-[#F2C12E] opacity-100 italic font-serif">
                Begins Here.
              </span>
            </h2>
            <p className="text-base md:text-lg text-slate-100 max-w-xl mx-auto mb-8 md:mb-10 font-medium leading-relaxed drop-shadow-md">
              Join an exclusive network of alumni shaping the future. Limited
              seats available for the upcoming session.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white font-black rounded-xl md:rounded-2xl h-14 md:h-16 px-8 md:px-12 hover:bg-[#F2C12E] hover:text-slate-900 transition-colors shadow-[0_0_40px_rgba(37,99,235,0.4)] uppercase tracking-widest border-none hover:scale-105 active:scale-95 duration-300 w-full sm:w-auto"
            >
              <Link href="/auth/sign-up">Start Registration</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* --- NEWSLETTER SECTION --- */}
      <section className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-blue-600 rounded-[3rem] p-10 md:p-20 flex flex-col items-center text-center relative overflow-hidden shadow-2xl shadow-blue-600/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

            <Mail className="w-12 h-12 text-white/80 mb-6" />
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Pioneering Elite Education
            </h3>
            <p className="text-blue-100/80 font-medium mb-10 max-w-xl text-lg">
              Get the absolute latest updates on upcoming admissions, curriculum
              upgrades, and outstanding school events delivered straight to your
              inbox.
            </p>

            <form
              className="flex w-full max-w-xl relative z-10 bg-white/10 p-2 rounded-full border border-white/20 shadow-2xl backdrop-blur-md transition-all hover:bg-white/15 focus-within:bg-white/20"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your best email address..."
                className="flex-1 bg-transparent text-white placeholder-white/60 px-4 md:px-6 outline-none w-full"
                required
              />
              <button
                type="submit"
                className="bg-[#F2C12E] text-slate-950 font-black px-6 md:px-10 py-3.5 rounded-full hover:bg-white transition-all shadow-lg active:scale-95 text-sm md:text-base whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 py-20 text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-[-20%] left-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-inner backdrop-blur-md">
              <img
                src={logoUrl}
                className="w-full h-full object-contain"
                alt="Logo"
              />
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
              Cultivating global leaders through uncompromised academic rigor
              and character development.
            </p>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
              Excellence Since 1990
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#F2C12E] mb-6">
              Discovery
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors duration-300"
                >
                  Our Vision
                </Link>
              </li>
              <li>
                <Link
                  href="/academics"
                  className="hover:text-white transition-colors duration-300"
                >
                  Curriculums
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-300"
                >
                  Admissions
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 ">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#F2C12E] mb-6">
              Portals
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-white transition-colors duration-300 items-center gap-2"
                >
                  Student Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-white transition-colors duration-300  items-center gap-2"
                >
                  Staff Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-white transition-colors duration-300  items-center gap-2"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#F2C12E] mb-6">
              Contact
            </h4>
            <p className="text-sm font-bold text-slate-300 mb-2">
              +234 (800) LUCKY-EDU
            </p>
            <p className="text-sm font-bold text-white underline decoration-blue-500 underline-offset-4 hover:decoration-white transition-all">
              info@luckyschools.edu
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TopBannerTypewriter() {
  const fullText = "WELCOME TO LUCKYSTAR INTERNATIONAL SCHOOLS";
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (text.length < fullText.length) {
            setText(fullText.slice(0, text.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 5000); // Wait 5s before erasing
          }
        } else {
          if (text.length > 0) {
            setText(fullText.slice(0, text.length - 1));
          } else {
            setIsDeleting(false);
          }
        }
      },
      isDeleting ? 40 : 100,
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting]);

  return (
    <div className="w-full bg-[#F2C12E] py-3 flex justify-center z-[90] relative border-b border-black/10 shadow-md">
      <div className="flex text-slate-950 font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] items-center h-4 md:h-5">
        <span>{text}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="ml-1.5 w-1.5 md:w-2 h-3.5 md:h-4 bg-slate-950 inline-block"
        />
      </div>
    </div>
  );
}

function ModernSectionCard({
  index,
  title,
  desc,
  features,
  reversed,
  icon: Icon,
  theme,
  imageUrl,
}: any) {
  const themeColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    gray: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const gradientMesh: Record<string, string> = {
    blue: "from-blue-100 via-blue-50 to-white",
    amber: "from-amber-100 via-amber-50 to-white",
    indigo: "from-indigo-100 via-indigo-50 to-white",
    emerald: "from-emerald-100 via-emerald-50 to-white",
    gray: "from-slate-200 via-slate-100 to-white",
  };

  const iconColors: Record<string, string> = {
    blue: "text-blue-500",
    amber: "text-amber-500",
    indigo: "text-indigo-500",
    emerald: "text-emerald-500",
    gray: "text-slate-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center p-6 md:p-8 lg:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group`}
    >
      <div
        className={`w-full lg:w-5/12 rounded-[2rem] aspect-[4/3] lg:aspect-square relative overflow-hidden flex items-center justify-center border border-slate-100 ${!imageUrl && `bg-gradient-to-br ${gradientMesh[theme]}`}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50"
            >
              <Icon
                className={`w-10 h-10 md:w-16 md:h-16 ${iconColors[theme]}`}
              />
            </motion.div>
          </>
        )}
        <div
          className={`absolute top-4 left-6 md:top-6 md:left-8 text-5xl md:text-7xl font-black tracking-tighter select-none transition-transform duration-700 group-hover:-translate-x-2 drop-shadow-md ${imageUrl ? "text-white/40 mix-blend-overlay" : "text-slate-900/5"}`}
        >
          0{index}
        </div>
      </div>

      <div className="w-full lg:w-7/12 space-y-4 md:space-y-6 px-1 md:px-2 lg:px-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${themeColors[theme]}`}
        >
          <Sparkles className="w-3 h-3" /> Module {index}
        </div>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter leading-tight">
          {title}
        </h3>
        <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">
          {desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-100">
          {features.map((feat: string, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${theme === "amber" ? "bg-amber-400" : theme === "blue" ? "bg-blue-400" : theme === "emerald" ? "bg-emerald-400" : theme === "gray" ? "bg-slate-400" : "bg-indigo-400"}`}
              />
              <span className="text-sm font-bold text-slate-600">{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
