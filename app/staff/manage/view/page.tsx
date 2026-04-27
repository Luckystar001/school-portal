"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, FileText, ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function ViewResultsDetails() {
  return (
    <Suspense fallback={<div className="p-8 text-center bg-[#FAF9F6] h-full">Loading details...</div>}>
      <ResultsDetailsContent />
    </Suspense>
  );
}

function ResultsDetailsContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const subjectId = searchParams.get("subject");
  const classId = searchParams.get("class");

  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchDetailedResults = async () => {
      if (!subjectId || !classId) return;

      try {
        // 1. Fetch Subject and Class Names
        const [{ data: subjectData }, { data: classData }] = await Promise.all([
           supabase.from("subjects").select("name").eq("id", subjectId).single(),
           supabase.from("classes").select("name").eq("id", classId).single()
        ]);
        
        const subjName = subjectData?.name || "Unknown Subject";
        setSubjectName(subjName);
        setClassName(classData?.name || "Unknown Class");

        // 2. Fetch all students in this class
        const { data: students } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .eq("class_id", classId)
          .eq("user_type", "student");

        if (students && students.length > 0) {
          const studentIds = students.map(s => s.id);
          
          // 3. Fetch their results matching the subject
          const { data: rawResults } = await supabase
            .from("results")
            .select("student_id, ca_score, exam_score, total_score, grade")
            .eq("subject_name", subjName)
            .in("student_id", studentIds);

          // 4. Map them together
          const mapped = students.map(student => {
             const res = rawResults?.find(r => r.student_id === student.id) || null;
             return {
                student_id: student.id,
                first_name: student.first_name,
                last_name: student.last_name,
                ca_score: res?.ca_score || 0,
                exam_score: res?.exam_score || 0,
                total_score: res?.total_score || ((res?.ca_score || 0) + (res?.exam_score || 0)),
                grade: res?.grade || "N/A"
             };
          });

          setResults(mapped.sort((a,b) => b.total_score - a.total_score));
        }
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedResults();
  }, [supabase, subjectId, classId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Compiling Records...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="text-blue-600 h-8 w-8" /> {subjectName}
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs">
            {className} Cohort Details
          </p>
        </div>
        
        <Link href={`/staff/results?subject=${subjectId}&class=${classId}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-600 transition-all shadow-md active:scale-95">
           Edit Scores
        </Link>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden rounded-[1.5rem]">
         <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
               <GraduationCap className="w-5 h-5 text-blue-400" />
               Class Performance Matrix
            </CardTitle>
         </CardHeader>
         <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                     <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="p-5 px-8">Rank</th>
                        <th className="p-5">Student Name</th>
                        <th className="p-5 text-center">CA (40)</th>
                        <th className="p-5 text-center">Exam (60)</th>
                        <th className="p-5 text-center">Total (100)</th>
                        <th className="p-5 text-center">Grade</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {results.length > 0 ? (
                        results.map((res: any, idx: number) => (
                           <tr key={res.student_id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="p-5 px-8 font-black text-slate-300">#{idx + 1}</td>
                              <td className="p-5 font-bold text-slate-800 uppercase text-xs tracking-tight">
                                 {res.first_name} {res.last_name}
                              </td>
                              <td className="p-5 text-center font-bold text-slate-500">{res.ca_score}</td>
                              <td className="p-5 text-center font-bold text-slate-500">{res.exam_score}</td>
                              <td className="p-5 text-center font-black text-blue-600">{res.total_score}</td>
                              <td className="p-5 text-center">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm border ${
                                    res.total_score >= 70 ? 'bg-green-100 text-green-700 border-green-200' :
                                    res.total_score >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                    'bg-red-100 text-red-700 border-red-200'
                                 }`}>
                                    {res.grade !== "N/A" ? res.grade : (
                                       res.total_score >= 70 ? 'A' :
                                       res.total_score >= 60 ? 'B' :
                                       res.total_score >= 50 ? 'C' :
                                       res.total_score >= 40 ? 'D' : 'F'
                                    )}
                                 </span>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={6} className="p-16 text-center text-slate-400 font-bold">
                              <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                              No students registered in this class.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
