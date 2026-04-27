import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ManageStaff() {
  const supabase = await createClient();

  // 1. Fetch staff data including the direct full_name column
  // We use !user_id to handle the relationship explicitly
  const { data: staffMembers, error: staffError } = await supabase
    .from("staff")
    .select(
      `
      id, 
      user_id, 
      full_name,
      title, 
      department, 
      bio, 
      created_at,
      profiles!user_id (
        first_name,
        last_name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (staffError) {
    console.error("Error loading staff directory:", staffError.message);
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Staff</h1>
          <p className="text-muted-foreground mt-2">
            View and manage staff member records
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Add New Staff
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Department
              </label>
              <select className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Departments</option>
                <option>Science</option>
                <option>Mathematics</option>
                <option>Technology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Staff</option>
                <option>Active</option>
                <option>On Leave</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 font-semibold text-foreground text-sm">
                    Name
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-sm">
                    Title
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-sm">
                    Department
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-sm">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-sm text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staffMembers && staffMembers.length > 0 ? (
                  staffMembers.map((staff: any) => {
                    // Logic to find the best name available
                    const displayName =
                      staff.full_name ||
                      (staff.profiles
                        ? `${staff.profiles.first_name} ${staff.profiles.last_name}`
                        : "No Name Set");

                    return (
                      <tr
                        key={staff.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-foreground font-medium">
                          {displayName}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {staff.title || "---"}
                        </td>
                        <td className="py-4 px-4 text-blue-600 font-medium">
                          {staff.department || "General"}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-4">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-700 font-medium text-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      No staff members found.
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
