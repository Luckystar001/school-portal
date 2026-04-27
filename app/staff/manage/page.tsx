"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Users,
  BarChart3,
  Trash2,
  Loader2,
  ChevronRight,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function ResultManagement() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyManagedResults = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get the subjects and classes assigned to this teacher
        const { data: assignments } = await supabase
          .from("courses")
          .select(
            `
            subject_id,
            class_id,
            subjects (name),
            classes (name)
          `,
          )
          .eq("staff_id", user.id);

        if (assignments && assignments.length > 0) {
          // 2. For each assignment, fetch the student results and calculate averages
          const resultData = await Promise.all(
            assignments.map(async (as: any) => {
              // Get all students for this specific class
              const { data: students } = await supabase
                .from("profiles")
                .select("id")
                .eq("class_id", as.class_id)
                .eq("user_type", "student");

              const studentIds = students?.map((s) => s.id) || [];

              let results: any[] = [];
              if (studentIds.length > 0) {
                // Fetch existing results for these students in this subject
                const { data } = await supabase
                  .from("results")
                  .select("ca_score, exam_score, total_score")
                  .eq("subject_name", as.subjects?.name)
                  .in("student_id", studentIds);

                results = data || [];
              }

              const totalScores = results.map(
                (r) =>
                  Number(r.total_score) ||
                  (Number(r.ca_score) || 0) + (Number(r.exam_score) || 0) ||
                  0
              );

              const avg =
                totalScores.length > 0
                  ? Math.round(
                      totalScores.reduce((acc, curr) => acc + curr, 0) /
                        totalScores.length
                    )
                  : 0;

              return {
                ...as,
                student_count: results.length,
                average: avg,
              };
            })
          );
          setSubjects(resultData);
        }
      } catch (error) {
        console.error("Management Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyManagedResults();
  }, [supabase]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
          Loading Result Manager...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Result Management
        </h1>
        <p className="text-slate-500 font-medium">
          Overview of graded subjects and performance for your classes.
        </p>
      </div>

      <div className="space-y-4">
        {subjects.length > 0 ? (
          subjects.map((item, index) => (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white group"
            >
              <CardContent className="p-0 flex items-center justify-between">
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                      First Term
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.subjects?.name} —{" "}
                      <span className="text-slate-400 font-medium uppercase text-sm">
                        {item.classes?.name}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {item.student_count} Students
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {item.average}% Avg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-6 flex items-center gap-3 border-l border-slate-100">
                  <Link
                    href={`/staff/manage/view?subject=${item.subject_id}&class=${item.class_id}`}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                  >
                    <FileText className="h-4 w-4" />
                    View Details
                  </Link>
                  <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BarChart3 className="h-12 w-12 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 font-bold uppercase text-xs">
              No results uploaded yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
