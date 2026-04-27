"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookPlus, Pencil, Trash2 } from "lucide-react";

export default function ManageSubjects() {
  const supabase = createClient();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        // We fetch the subject details AND the related class name
        const { data, error } = await supabase
          .from("subjects")
          .select(
            `
            id,
            name,
            code,
            class_id,
            classes (name)
          `,
          )
          .order("name", { ascending: true });

        if (error) throw error;
        setSubjects(data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [supabase]);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Manage Subjects
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            View and manage subjects registered to specific classes.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-5 rounded-xl shadow-lg shadow-blue-900/20">
          <BookPlus className="mr-2 h-5 w-5" /> Add New Subject
        </Button>
      </div>

      {/* Subjects Table */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 py-6">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
            Subject List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <th className="py-4 px-8">Subject Name</th>
                  <th className="py-4 px-4">Subject Code</th>
                  <th className="py-4 px-4">Registered Class</th>
                  <th className="py-4 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="text-slate-400 font-bold uppercase text-[10px]">
                          Syncing Subjects...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <tr
                      key={subject.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-8 text-slate-900 font-bold uppercase text-xs">
                        {subject.name}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-mono text-xs">
                        {subject.code}
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-blue-100 shadow-sm">
                          {subject.classes?.name || "No Class"}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-right space-x-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-20 text-center text-slate-400 font-bold uppercase text-xs"
                    >
                      No subjects registered yet.
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
