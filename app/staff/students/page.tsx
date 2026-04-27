"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, GraduationCap, Loader2 } from "lucide-react";

export default function StaffStudentDirectory() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMyStudents = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get classes assigned to this staff member from the courses table
        const { data: assignments, error: assignError } = await supabase
          .from("courses")
          .select("class_id")
          .eq("staff_id", user.id);

        if (assignError) throw assignError;

        if (assignments && assignments.length > 0) {
          const classIds = assignments.map((a) => a.class_id);

          // 2. Fetch students in those specific classes
          // Using .ilike for user_type to handle 'Student' or 'student'
          const { data: studentData, error: studentError } = await supabase
            .from("profiles")
            .select(
              "id, first_name, last_name, current_class, email, user_type",
            )
            .in("class_id", classIds)
            .ilike("user_type", "student")
            .order("current_class", { ascending: true });

          if (studentError) throw studentError;
          setStudents(studentData || []);
        }
      } catch (error) {
        console.error("Directory Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStudents();
  }, [supabase]);

  // Filter the list based on the search input
  const filteredStudents = students.filter((s) =>
    `${s.first_name} ${s.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">
          Loading Student Directory...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Users className="text-blue-600 h-8 w-8" /> My Students
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Viewing enrollment for your assigned classes.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-900 text-white py-5 px-6">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            Active Student Roster ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-5 px-8">Full Name</th>
                  <th className="p-5">Class</th>
                  <th className="p-5">Email Address</th>
                  <th className="p-5 text-right px-8">Portal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="p-5 px-8 font-bold text-slate-800 uppercase text-xs tracking-tight">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="p-5">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm border border-blue-200">
                          {student.current_class || "Unassigned"}
                        </span>
                      </td>
                      <td className="p-5 text-slate-500 font-medium italic">
                        {student.email || "No email provided"}
                      </td>
                      <td className="p-5 text-right px-8">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase text-green-700 border border-green-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-10 w-10 text-slate-200" />
                        <p className="text-slate-400 font-bold">
                          No students found in your assigned classes.
                        </p>
                        <p className="text-xs text-slate-300 uppercase font-black">
                          Check Admin Course Assignments
                        </p>
                      </div>
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
