"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION: CINEMATIC DARK --- */}
      <section className="relative overflow-hidden bg-slate-950 pt-32 pb-40 md:pt-40 md:pb-48 z-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-[#F2C12E]/10 blur-[100px] rounded-full" />
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
              Connection & Support
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
            GET IN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#F2C12E] to-blue-600">
              TOUCH.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            We are here to answer your questions and guide you through the
            journey of excellence.
          </p>
        </motion.div>
      </section>

      {/* --- CONTACT INFORMATION --- */}
      <section className="py-24 bg-white relative -mt-16 rounded-t-[3.5rem] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <ContactCard
              icon={Mail}
              title="Digital Correspondence"
              details={["info@luckyschools.edu", "admissions@luckyschools.edu"]}
              href="mailto:info@luckyschools.edu"
            />
            <ContactCard
              icon={Phone}
              title="Direct Lines"
              details={["+2348132691148-LUCKY", "+2349012465184-ADMIN"]}
            />
            <ContactCard
              icon={MapPin}
              title="School Location"
              details={[
                "25 Egahi Close Port Harcourt",
                "Rivers State, Nigeria",
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Office Hours: Sidebar Style */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Clock size={120} />
                </div>
                <h3 className="text-2xl font-black mb-8 tracking-tighter">
                  Office Hours
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[#F2C12E] text-[10px] font-black uppercase tracking-widest mb-2">
                      School Days
                    </p>
                    <p className="text-slate-300 font-bold">
                      Mon — Fri: 7:30 AM - 5:00 PM
                    </p>
                  </div>
                  <div>
                    <p className="text-[#F2C12E] text-[10px] font-black uppercase tracking-widest mb-2">
                      Weekends
                    </p>
                    <p className="text-slate-300 font-bold">
                      Closed for Public Holidays
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form: Elite Style */}
            <div className="lg:col-span-3 bg-slate-50 p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-inner">
              <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter">
                Send a Secure Message
              </h2>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 p-6 bg-blue-600 rounded-3xl text-white shadow-xl"
                  >
                    <p className="font-black text-lg">
                      Message Sent Successfully
                    </p>
                    <p className="text-sm text-blue-100">
                      Our administrative team will reach out to you within 24
                      hours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                  />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl border-none bg-white text-slate-900 font-bold shadow-sm focus:ring-2 focus:ring-blue-600 appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="admission">Admission</option>
                      <option value="academic">Academic Support</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-6 py-5 rounded-[2rem] border-none bg-white text-slate-900 font-bold shadow-sm focus:ring-2 focus:ring-blue-600"
                    placeholder="How can we help you today?"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto bg-slate-950 hover:bg-blue-600 text-white font-black rounded-2xl h-16 px-12 text-lg transition-all shadow-xl"
                >
                  Send Message <Send className="ml-3 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-600 py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">
            &copy; 2026 Lucky International Schools. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ContactCard({ icon: Icon, title, details, href }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 text-center flex flex-col items-center"
    >
      <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4">
        {title}
      </h3>
      <div className="space-y-1">
        {details.map((line: string, i: number) => (
          <p key={i} className="text-slate-500 font-bold text-sm">
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
        {label}
      </label>
      <Input
        {...props}
        className="h-14 rounded-2xl border-none bg-white text-slate-900 font-bold shadow-sm focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}
