import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { BookOpen, GraduationCap, Calendar, User, MapPin } from "lucide-react";

export default async function Classes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch the student's profile and join with their assigned class
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      *,
      classes (
        id,
        name
      )
    `,
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    return (
      <div className="p-8 text-center text-slate-500 font-bold uppercase text-xs">
        Profile not found. Contact Admin.
      </div>
    );
  }

  // Fetch all subjects registered to this specific class
  const { data: subjects, error: subjectError } = await supabase
    .from("subjects")
    .select("*")
    .eq("class_id", profile.class_id);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <GraduationCap className="text-blue-600 h-8 w-8" /> My Classes
        </h1>
        <p className="text-slate-500 font-medium">
          View your academic curriculum for{" "}
          {profile.classes?.name || "your level"}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Class Info & Schedule Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl overflow-hidden">
            <div className="h-2 bg-blue-600 w-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Academic Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-900 uppercase">
                {profile.classes?.name || "Unassigned"}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">
                    Status
                  </span>
                  <span className="text-emerald-600 font-black uppercase">
                    Enrolled
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">
                    Session
                  </span>
                  <span className="text-slate-900 font-black uppercase">
                    2025/2026
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">
                Weekly Routine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <Calendar className="h-10 w-10 text-slate-700" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4">
                  Timetable updates are released every Monday morning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Registered Subjects Table */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-slate-50 py-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Registered Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/50">
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                      <th className="py-4 px-8">Subject Name</th>
                      <th className="py-4 px-4">Subject Code</th>
                      <th className="py-4 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {subjects && subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <tr
                          key={subject.id}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="py-4 px-8 font-black text-slate-800 uppercase text-xs">
                            {subject.name}
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-mono text-xs">
                            {subject.code}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-tighter">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-20 text-center text-slate-400 font-bold uppercase text-xs"
                        >
                          No subjects registered for this class.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <div className="bg-blue-600 p-1 rounded text-white mt-0.5">
              <MapPin className="h-3 w-3" />
            </div>
            <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
              <strong>Note:</strong> Classrooms are assigned by the department
              head. If a subject location is missing, please report to the ICT
              center on the ground floor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
