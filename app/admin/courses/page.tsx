"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, ShieldCheck } from "lucide-react";

export default function AdminCourseManager() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Data lists
  const [staff, setStaff] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  // Form State
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [staffRes, classRes, subRes, assignRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("user_type", "staff"),
      supabase.from("classes").select("id, name").order("name"),
      supabase.from("subjects").select("id, name, class_id"),
      supabase.from("courses").select(`
        id,
        staff_id,
        profiles!courses_staff_id_fkey (first_name, last_name),
        classes (name),
        subjects (name)
      `),
    ]);

    setStaff(staffRes.data || []);
    setClasses(classRes.data || []);
    setSubjects(subRes.data || []);
    setAssignments(assignRes.data || []);
  };

  const handleAssign = async () => {
    if (!selectedStaff || !selectedClass || !selectedSubject) return;
    setLoading(true);

    const { error } = await supabase.from("courses").insert({
      staff_id: selectedStaff,
      class_id: selectedClass,
      subject_id: selectedSubject,
      session: "2025/2026",
    });

    if (error) {
      alert("Assignment Error: " + error.message);
    } else {
      setSelectedSubject("");
      fetchData(); // Refresh list
    }
    setLoading(false);
  };

  const removeAssignment = async (id: string) => {
    if (
      !confirm("Are you sure you want to remove this teacher from this course?")
    )
      return;
    await supabase.from("courses").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">
          Course Assignments
        </h1>
      </div>

      {/* Assignment Creator */}
      <Card className="border-t-4 border-blue-600 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Assign Teacher to Subject</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              1. Staff Member
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Select Staff...</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              2. Class
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSubject(""); // Reset subject if class changes
              }}
            >
              <option value="">Select Class...</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              3. Subject
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedSubject}
              disabled={!selectedClass}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select Subject...</option>
              {subjects
                .filter((s) => s.class_id === selectedClass)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          <Button
            onClick={handleAssign}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 font-bold"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Plus className="mr-2" /> LINK COURSE
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Active Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Course Links</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4 px-6">Teacher</th>
                <th className="p-4">Class</th>
                <th className="p-4">Subject</th>
                <th className="p-4 text-right px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {assignments.map((as) => (
                <tr key={as.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 px-6 font-bold text-slate-700">
                    {as.profiles?.first_name} {as.profiles?.last_name}
                  </td>
                  <td className="p-4 font-medium text-slate-600">
                    {as.classes?.name}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      {as.subjects?.name}
                    </span>
                  </td>
                  <td className="p-4 text-right px-6">
                    <button
                      onClick={() => removeAssignment(as.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {assignments.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No course assignments yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
