"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Award, Calendar, BookOpen, Loader2 } from "lucide-react";

export default function StudentResultsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [groupedResults, setGroupedResults] = useState<any>({});

  useEffect(() => {
    const fetchMyResults = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Correct Supabase Query (No .catch() at the end)
        const { data: allResults, error } = await supabase
          .from("results")
          .select("*")
          .eq("student_id", user.id)
          .eq("status", "published") // Only show approved results
          .order("session", { ascending: false })
          .order("term", { ascending: false });

        if (error) {
          console.error("Supabase Error:", error.message);
          return;
        }

        // Group results by session and term for better UI organization
        const grouped = (allResults || []).reduce((acc: any, result: any) => {
          const key = `${result.session} - ${result.term}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(result);
          return acc;
        }, {});

        setGroupedResults(grouped);
      } catch (err) {
        console.error("Unexpected Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyResults();
  }, [supabase]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
          Fetching your academic records...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Award className="text-blue-600 h-8 w-8" /> My Results
        </h1>
        <p className="text-slate-500 font-medium">
          View your published grades and academic performance.
        </p>
      </div>

      {Object.keys(groupedResults).length > 0 ? (
        Object.entries(groupedResults).map(
          ([termKey, scores]: [string, any]) => (
            <div key={termKey} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">
                  {termKey}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scores.map((res: any) => (
                  <Card
                    key={res.id}
                    className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white"
                  >
                    <CardContent className="p-0 flex items-center">
                      <div className="bg-blue-600 p-6 text-white flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-[10px] font-black uppercase opacity-80">
                          Total
                        </span>
                        <span className="text-3xl font-black leading-none">
                          {res.total_score}
                        </span>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-800 uppercase text-sm tracking-tight">
                            {res.subject_name}
                          </h3>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                            {res.grade || "N/A"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-[9px] uppercase font-black text-slate-400">
                              CA Score
                            </p>
                            <p className="text-sm font-bold text-slate-600">
                              {res.ca_score || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase font-black text-slate-400">
                              Exam Score
                            </p>
                            <p className="text-sm font-bold text-slate-600">
                              {res.exam_score || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ),
        )
      ) : (
        <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <FileText className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-slate-900 font-bold">No results found</h3>
          <p className="text-slate-400 text-sm mt-1 uppercase font-black tracking-widest text-[10px]">
            Your results will appear here once approved by the Admin.
          </p>
        </div>
      )}
    </div>
  );
}
