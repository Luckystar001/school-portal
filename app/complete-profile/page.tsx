"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { UserCircle, Sparkles, GraduationCap, ShieldCheck } from "lucide-react";

export default function CompleteProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("student");
  const [classId, setClassId] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from("classes").select("*").order("name");
      if (data) setClasses(data);
    };
    fetchClasses();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
        class_id: userType === "student" ? classId : null,
        email: user.email,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Redirect based on role
      if (userType === "admin") router.push("/admin");
      else if (userType === "staff") router.push("/staff/dashboard");
      else router.push("/dashboard");

      router.refresh();
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.95)), url('/Schpic.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background Cinematic Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F2C12E]/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="bg-slate-900/60 border-white/10 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 pb-6 text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <UserCircle className="text-blue-400 w-10 h-10" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter text-white uppercase">
              Setup Your Profile
            </CardTitle>
            <CardDescription className="text-slate-300 font-medium">
              Complete your registration to access the Elite Portal
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-12 px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    First Name
                  </Label>
                  <Input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Last Name
                  </Label>
                  <Input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  I am a...
                </Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff/Teacher</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userType === "student" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Assigned Class
                  </Label>
                  <Select value={classId} onValueChange={setClassId}>
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue placeholder="Select your current class" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#F2C12E] hover:bg-white text-slate-950 font-black rounded-xl transition-all shadow-xl shadow-[#F2C12E]/10"
              >
                {loading ? (
                  <span className="flex items-center gap-2 italic">
                    <Sparkles className="animate-spin w-4 h-4" /> SECURING
                    PROFILE...
                  </span>
                ) : (
                  "FINALIZE ACCOUNT"
                )}
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
              <ShieldCheck className="text-white w-4 h-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white">
                Encrypted Profile Verification
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
