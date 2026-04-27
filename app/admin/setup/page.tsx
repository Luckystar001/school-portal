"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Book, Trash2, Loader2, X } from "lucide-react";

export default function SchoolSetup() {
  const supabase = createClient();
  const [classes, setClasses] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeClass, setActiveClass] = useState<any>(null);
  const [newSubjectName, setNewSubjectName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    const { data } = await supabase
      .from("classes")
      .select("*, subjects(*)")
      .order("name", { ascending: true });

    setClasses(data || []);
    setIsLoading(false);
  }

  // Common subjects list
  const commonSubjects = activeClass?.name.toUpperCase().includes("JSS")
    ? [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Basic Technology",
        "Social Studies",
        "Civic Education",
        "Agricultural Science",
        "Home Economics",
        "Physical & Health Education",
        "Computer Science",
      ]
    : [
        "Mathematics",
        "English Language",
        "Physics",
        "Chemistry",
        "Biology",
        "Further Mathematics",
        "Economics",
        "Government",
        "Literature in English",
        "Commerce",
        "Geography",
        "Computer Science",
      ];

  async function addClass() {
    if (!newClassName.trim()) return;
    const { error } = await supabase
      .from("classes")
      .insert([{ name: newClassName.trim() }]);
    if (error) {
      alert(error.message);
    } else {
      setNewClassName("");
      fetchData();
    }
  }

  async function addSubject() {
    const trimmedName = newSubjectName.trim();
    if (!trimmedName || !activeClass) return;

    // FRONTEND VALIDATION: Check if subject already exists in this class
    const isDuplicate = activeClass.subjects?.some(
      (sub: any) => sub.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      alert(`${trimmedName} is already added to ${activeClass.name}`);
      return;
    }

    const { error } = await supabase.from("subjects").insert([
      {
        name: trimmedName,
        class_id: activeClass.id,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      setNewSubjectName("");
      setIsModalOpen(false);
      fetchData();
    }
  }

  async function deleteClass(id: string) {
    if (
      !confirm("Are you sure? This will delete all subjects in this class too.")
    )
      return;
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (!error) fetchData();
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto text-slate-900">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">School Structure</h1>
        <p className="text-slate-500 text-sm font-medium">
          Manage your classes and academic subjects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Add Class Form */}
        <Card className="shadow-sm border-blue-100 bg-white">
          <CardHeader>
            <CardTitle className="text-xs font-black flex items-center gap-2 text-blue-600 uppercase tracking-widest">
              <Plus className="w-4 h-4" /> Add New Class
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium bg-slate-50"
              placeholder="e.g. JSS 1"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-5 shadow-lg shadow-blue-100"
              onClick={addClass}
            >
              Create Class
            </Button>
          </CardContent>
        </Card>

        {/* Right: Classes & Subjects List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Active Classes
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 h-8 w-8 opacity-40" />
            </div>
          ) : (
            classes.map((cls) => (
              <Card
                key={cls.id}
                className="hover:shadow-md transition-shadow border-slate-200 overflow-hidden bg-white"
              >
                <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between">
                  <div className="p-6 space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">
                        {cls.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cls.subjects?.length > 0 ? (
                        // UI PROTECTION: Filter duplicates in case the DB has them
                        cls.subjects
                          .filter(
                            (sub: any, index: number, self: any[]) =>
                              index ===
                              self.findIndex(
                                (s) =>
                                  s.name.toLowerCase() ===
                                  sub.name.toLowerCase(),
                              ),
                          )
                          .map((sub: any) => (
                            <span
                              key={sub.id}
                              className="px-3 py-1 rounded-lg text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-tight"
                            >
                              {sub.name}
                            </span>
                          ))
                      ) : (
                        <p className="text-xs text-slate-400 italic font-medium">
                          No subjects added yet
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 md:bg-transparent p-4 md:p-6 flex items-center gap-2 border-t md:border-t-0 border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white font-bold transition-all px-4"
                      onClick={() => {
                        setActiveClass(cls);
                        setIsModalOpen(true);
                      }}
                    >
                      <Book className="w-4 h-4 mr-2" /> Add Subject
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-300 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteClass(cls.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 bg-white border-none">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-lg font-black text-slate-800">
                Add Subject to {activeClass?.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-4 h-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subject Name
                </label>
                <input
                  list="subject-suggestions"
                  autoFocus
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-bold"
                  placeholder="e.g. Mathematics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubject()}
                />
                <datalist id="subject-suggestions">
                  {commonSubjects.map((sub) => (
                    <option key={sub} value={sub} />
                  ))}
                </datalist>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 font-bold py-6 border-slate-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold py-6"
                  onClick={addSubject}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
