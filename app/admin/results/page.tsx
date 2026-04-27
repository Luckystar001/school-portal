"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Trash2, Loader2, Sparkles } from "lucide-react";

export default function AdminResultsManagement() {
  const supabase = createClient();
  const [pendingResults, setPendingResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoized fetch function so we can call it after updates
  const fetchResults = useCallback(async () => {
    const { data } = await supabase
      .from("results")
      .select(
        `
        *,
        profiles:student_id (first_name, last_name)
      `,
      )
      .eq("status", "draft");
    setPendingResults(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Handle Single Approval
  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("results")
      .update({ status: "published" })
      .eq("id", id);

    if (!error) {
      setPendingResults((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // NEW: Handle Bulk Approval
  const handleApproveAll = async () => {
    if (pendingResults.length === 0) return;

    const confirmApprove = confirm(
      `Are you sure you want to approve all ${pendingResults.length} draft results?`,
    );
    if (!confirmApprove) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("results")
        .update({ status: "published" })
        .eq("status", "draft"); // Targets all drafts globally

      if (error) throw error;

      // Clear the local state since everything is now published
      setPendingResults([]);
      alert("All results have been published successfully!");
    } catch (error: any) {
      console.error("Bulk Approval Error:", error.message);
      alert("Error approving results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Results Approval
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Review and publish teacher uploads to student portals
          </p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 px-6 py-6 rounded-xl font-bold transition-all active:scale-95"
          onClick={handleApproveAll}
          disabled={loading || pendingResults.length === 0}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Approve All Drafts
        </Button>
      </div>

      {/* Results List */}
      <div className="grid gap-4">
        {pendingResults.map((res) => (
          <Card
            key={res.id}
            className="border-none border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-black text-slate-800 uppercase text-sm tracking-tight">
                  {res.profiles?.first_name} {res.profiles?.last_name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                    {res.subject_name}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {res.term} — {res.session}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[9px] uppercase text-slate-400 font-black tracking-widest">
                    Total Score
                  </p>
                  <p className="text-2xl font-black text-blue-600 leading-none mt-1">
                    {res.total_score}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-lg font-bold text-xs"
                    onClick={() => handleApprove(res.id)}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingResults.length === 0 && !loading && (
          <div className="text-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-slate-900 font-bold">All caught up!</h3>
            <p className="text-slate-400 text-sm mt-1">
              No pending results require approval at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
