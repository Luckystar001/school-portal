"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      if (authData?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profile?.user_type === "admin") {
          router.push("/admin");
        } else if (profile?.user_type === "staff") {
          router.push("/staff/dashboard");
        } else {
          router.push("/dashboard");
        }

        router.refresh();
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Invalid login credentials",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.9)), url('/Schpic.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F2C12E]/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pt-10 pb-6 text-center">
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <ShieldCheck className="text-blue-400 w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter text-white">
                PORTAL LOGIN
              </CardTitle>
              <CardDescription className="text-slate-300 font-medium">
                Access your personalized school dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@school.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:ring-blue-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1"
                      >
                        Password
                      </Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-blue-600"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#F2C12E] hover:bg-white text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-[#F2C12E]/10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="animate-spin w-4 h-4" /> VERIFYING...
                    </span>
                  ) : (
                    "LOGIN TO PORTAL"
                  )}
                </Button>

                <div className="text-center text-xs">
                  <span className="text-slate-300 font-bold uppercase tracking-widest">
                    Need Help?
                  </span>{" "}
                  <Link
                    href="/contact"
                    className="font-black text-blue-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Contact Admin
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
          © 2026 Lucky International Schools
        </p>
      </div>
    </div>
  );
}
