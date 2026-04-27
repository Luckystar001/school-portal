import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default async function Settings() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Notification Preferences */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about grades and announcements</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Get alerts about important events</p>
            </div>
            <input type="checkbox" className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Result Notifications</p>
              <p className="text-sm text-muted-foreground">Be notified when results are released</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Public Profile</p>
              <p className="text-sm text-muted-foreground">Allow other students to view your profile</p>
            </div>
            <input type="checkbox" className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Share Results</p>
              <p className="text-sm text-muted-foreground">Allow parents to view your results</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded">
            <p className="text-sm text-muted-foreground">
              Last password change: <span className="font-medium text-foreground">3 months ago</span>
            </p>
          </div>
          <Button className="bg-secondary hover:bg-secondary/90 text-primary">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Language & Display */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Language & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Language</label>
            <select className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
          <div className="border-t border-border pt-4">
            <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
            <select className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-secondary">
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-foreground mb-3">Delete Account</p>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
              Delete Account
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
  )
}
