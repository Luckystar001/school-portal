import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure school system settings and preferences
        </p>
      </div>

      {/* School Information */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              School Name
            </label>
            <input
              type="text"
              defaultValue="Lucky International Schools Secondary School"
              className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              School Email
            </label>
            <input
              type="email"
              defaultValue="info@stexcellence.edu"
              className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              School Phone
            </label>
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address
            </label>
            <input
              type="text"
              defaultValue="123 Excellence Avenue, City Center, State 12345"
              className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Academic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Current Academic Year
            </label>
            <input
              type="text"
              defaultValue="2024/2025"
              className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Current Term
            </label>
            <select className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary">
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Grading System
            </label>
            <select className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary">
              <option>A-F (Traditional)</option>
              <option>0-100 (Percentage)</option>
              <option>5.0 GPA</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">
                Disable student access during maintenance
              </p>
            </div>
            <input type="checkbox" className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Send system email notifications
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">SMS Alerts</p>
              <p className="text-sm text-muted-foreground">
                Enable SMS alerts for important events
              </p>
            </div>
            <input type="checkbox" className="w-5 h-5 cursor-pointer" />
          </div>
        </CardContent>
      </Card>

      {/* Backup & Security */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Backup & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-foreground mb-3">Last Backup</p>
            <p className="text-muted-foreground">Today at 2:30 AM</p>
            <Button className="mt-3 bg-secondary hover:bg-secondary/90 text-primary">
              Backup Now
            </Button>
          </div>
          <div className="border-t border-border pt-4">
            <p className="font-medium text-foreground mb-3">
              Change Admin Password
            </p>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button className="bg-secondary hover:bg-secondary/90 text-primary">
          Save Changes
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
