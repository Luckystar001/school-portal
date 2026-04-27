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
import { UserPlus, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/complete-profile`,
        },
      });

      if (error) throw error;

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during registration",
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
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F2C12E]/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Navigation Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
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
                <UserPlus className="text-blue-400 w-7 h-7" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter text-white uppercase">
                Create Account
              </CardTitle>
              <CardDescription className="text-slate-300 font-medium">
                Join the Lucky International elite portal
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-10">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1"
                    >
                      School Email
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
                    <Label
                      htmlFor="password"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1"
                    >
                      Create Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="repeat-password"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
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
                  className="w-full h-12 bg-[#F2C12E] hover:bg-white text-slate-950 font-black rounded-xl transition-all shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="animate-spin w-4 h-4" /> VERIFYING...
                    </span>
                  ) : (
                    "REGISTER NOW"
                  )}
                </Button>

                <div className="pt-4 text-center">
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-400 hover:text-white transition-colors"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
          <ShieldCheck className="text-slate-400 w-4 h-4" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
            Secure Student Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
