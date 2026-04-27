"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader2, FilterX, AlertCircle } from "lucide-react";

export default function ManageStudents() {
  const supabase = createClient();
  const [students, setStudents] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    try {
      // 1. Fetch the master list of classes for the dropdown
      const { data: classes, error: classError } = await supabase
        .from("classes")
        .select("id, name")
        .order("name");

      if (classError) throw classError;
      setClassList(classes || []);

      // 2. Load all students initially
      await applyFilters();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function applyFilters() {
    setLoading(true);
    setError(null);
    try {
      // 3. Build query using !inner join to ensure strict class matching
      let query = supabase
        .from("profiles")
        .select(
          `
          id, 
          first_name, 
          last_name, 
          class_id,
          classes!inner ( name )
        `,
        )
        .eq("user_type", "student");

      // 4. Filter by Class UUID if selected
      if (selectedClass && selectedClass !== "") {
        query = query.eq("class_id", selectedClass);
      }

      const { data, error: fetchError } = await query.order("first_name", {
        ascending: true,
      });

      if (fetchError) throw fetchError;
      setStudents(data || []);
    } catch (err: any) {
      console.error("Filter Error:", err.message);
      setError("Failed to fetch students. Please check your connection.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Student Enrollment
        </h1>
        <p className="text-slate-500 font-medium">
          View and manage students linked to academic classes
        </p>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Academic Class
              </label>
              <select
                className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-700 appearance-none"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">View All Classes</option>
                {classList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={applyFilters}
              disabled={loading}
              className="px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Apply Filters"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Results Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="py-4 px-6 font-bold text-slate-700 uppercase tracking-tighter">
                  Student Name
                </th>
                <th className="py-4 px-6 font-bold text-slate-700 text-center uppercase tracking-tighter">
                  Class Enrollment
                </th>
                <th className="py-4 px-6 font-bold text-slate-700 text-right uppercase tracking-tighter">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600 h-10 w-10 opacity-20" />
                    <p className="mt-4 text-slate-400 font-medium">
                      Fetching records...
                    </p>
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {student.first_name} {student.last_name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {student.classes ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100 uppercase tracking-tight">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {student.classes.name}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic text-xs font-semibold">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-black text-xs uppercase tracking-widest mr-6 transition-colors">
                        Edit
                      </button>
                      <button className="text-slate-300 hover:text-red-600 font-black text-xs uppercase tracking-widest transition-colors">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-24 text-center space-y-4">
                    <FilterX className="mx-auto h-12 w-12 text-slate-200" />
                    <p className="text-slate-400 italic font-medium">
                      No students found for this selection.
                    </p>
                    <Button
                      variant="link"
                      className="text-blue-600"
                      onClick={() => {
                        setSelectedClass("");
                        applyFilters();
                      }}
                    >
                      Clear all filters
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
