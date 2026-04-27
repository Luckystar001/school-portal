"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookCheck, School, Layers, Loader2 } from "lucide-react";

export default function StaffSubjectsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch subjects joined with class names
        const { data, error } = await supabase
          .from("courses")
          .select(
            `
            id,
            subjects (name),
            classes (name),
            session
          `,
          )
          .eq("staff_id", user.id);

        if (error) throw error;
        setSubjects(data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedSubjects();
  }, [supabase]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium tracking-tight">
          Loading Assigned Courses...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
          <BookOpen className="text-blue-600 h-8 w-8" /> My Subjects
        </h1>
        <p className="text-slate-500 font-medium">
          Detailed list of your teaching assignments for the current session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length > 0 ? (
          subjects.map((item) => (
            <Card
              key={item.id}
              className="border-none shadow-lg hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className="h-2 bg-blue-600 w-full" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <BookCheck className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {item.session || "2025/2026"}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 mt-4 group-hover:text-blue-600 transition-colors">
                  {item.subjects?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <School className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {item.classes?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Layers className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium">
                    Academic Session Course
                  </span>
                </div>

                <button className="w-full mt-2 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors shadow-md shadow-slate-200">
                  View Syllabus
                </button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-400">
              No Subjects Assigned
            </h3>
            <p className="text-sm text-slate-300 uppercase font-black">
              Contact Admin for course linking
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
