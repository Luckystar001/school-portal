"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, BookOpen } from "lucide-react";

export default function StaffResultsEntry() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading portal...</div>}
    >
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const urlSubject = searchParams.get("subject");

  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]); // New state for assignments
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [scores, setScores] = useState<
    Record<string, { ca: number; exam: number }>
  >({});

  // 1. Fetch only courses assigned to THIS logged-in staff
  useEffect(() => {
    const fetchMyCourses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          class_id,
          classes (id, name),
          subject_id,
          subjects (id, name)
        `,
        )
        .eq("staff_id", user.id);

      if (data) {
        setAssignments(data);

        // Extract unique classes from assignments
        const uniqueClasses = Array.from(
          new Map(data.map((item) => [item.classes.id, item.classes])).values(),
        );
        setClasses(uniqueClasses);
      }
    };
    fetchMyCourses();
  }, []);

  // 2. Filter subjects based on selected class
  useEffect(() => {
    if (!selectedClass) {
      setSubjects([]);
      return;
    }

    const availableSubjects = assignments
      .filter((a) => a.class_id === selectedClass)
      .map((a) => a.subjects);

    setSubjects(availableSubjects);
    setSelectedSubject(""); // Reset subject when class changes
  }, [selectedClass, assignments]);

  // 3. Fetch Students when class is selected
  useEffect(() => {
    if (!selectedClass) return;
    const fetchStudents = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("class_id", selectedClass)
        .eq("user_type", "student");
      setStudents(data || []);
    };
    fetchStudents();
  }, [selectedClass]);

  // 4. Fetch existing scores (Logic remains same as your previous update)
  useEffect(() => {
    if (!selectedSubject) return;
    const fetchExistingScores = async () => {
      const subjectObj = subjects.find((s) => s.id === selectedSubject);
      const { data } = await supabase
        .from("results")
        .select("student_id, ca_score, exam_score")
        .eq("subject_name", subjectObj?.name);

      if (data) {
        const existing: Record<string, { ca: number; exam: number }> = {};
        data.forEach((r) => {
          existing[r.student_id] = { ca: r.ca_score, exam: r.exam_score };
        });
        setScores(existing);
      }
    };
    fetchExistingScores();
  }, [selectedSubject, subjects]);

  // handleScoreUpdate and submitResults remain identical to your current code...
  const handleScoreUpdate = (
    studentId: string,
    type: "ca" | "exam",
    value: string,
  ) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { ca: 0, exam: 0 }),
        [type]: parseFloat(value) || 0,
      },
    }));
  };

  const submitResults = async () => {
    if (!selectedSubject || students.length === 0) return;
    setLoading(true);
    const subjectObj = subjects.find((s) => s.id === selectedSubject);
    const resultsToInsert = students.map((student) => {
      const s = scores[student.id] || { ca: 0, exam: 0 };
      return {
        student_id: student.id,
        subject_name: subjectObj?.name,
        ca_score: s.ca,
        exam_score: s.exam,
        term: "First Term",
        session: "2025/2026",
      };
    });

    const { error } = await supabase.from("results").upsert(resultsToInsert, {
      onConflict: "student_id,subject_name,term,session",
    });

    if (error) alert("Database Error: " + error.message);
    else alert("Results synchronized successfully!");
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Staff Grading Portal
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardContent className="pt-6 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              1. Assigned Class
            </label>
            <select
              className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a Class...</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              2. Your Subject
            </label>
            <select
              className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-50"
              disabled={!selectedClass}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select a Subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* The rest of your table UI remains exactly the same... */}
      {selectedSubject && (
        <Card className="border-slate-200 shadow-xl overflow-hidden">
          {/* ... existing table code ... */}
          <CardHeader className="bg-slate-900 text-white py-4">
            <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
              <Users className="w-4 h-4" /> Students Enrollment:{" "}
              {students.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-500 uppercase">
                <tr>
                  <th className="p-4 px-6 text-left">Name</th>
                  <th className="p-4 text-center">CA</th>
                  <th className="p-4 text-center">Exam</th>
                  <th className="p-4 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((student) => {
                  const s = scores[student.id] || { ca: 0, exam: 0 };
                  return (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="p-4 px-6 font-bold text-slate-800 uppercase text-xs">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          className="w-16 p-1 border rounded text-center font-bold"
                          value={s.ca || ""}
                          onChange={(e) =>
                            handleScoreUpdate(student.id, "ca", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          className="w-16 p-1 border rounded text-center font-bold"
                          value={s.exam || ""}
                          onChange={(e) =>
                            handleScoreUpdate(
                              student.id,
                              "exam",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-4 text-center font-black text-blue-600">
                        {s.ca + s.exam}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 flex justify-end">
              <Button
                onClick={submitResults}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 font-bold px-8"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "UPLOAD RESULTS"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
