"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Lock, Eye, Globe, LogOut, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { user } = useUser()

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear()
      window.location.href = "/auth/signin"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar type="customer" />

      <div className="lg:ml-64">
        <DashboardHeader title="Settings" userName={user?.name || "Customer"} userRole="Customer" />

        <main className="p-4 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and security</p>
          </div>

          {/* Notification Settings */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-foreground">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">App push notifications</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Special offers and updates</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-foreground">Privacy & Visibility</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Public Profile</p>
                  <p className="text-sm text-muted-foreground">Make your profile visible to professionals</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Show Activity Status</p>
                  <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Allow Messages</p>
                  <p className="text-sm text-muted-foreground">Accept messages from professionals</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-foreground">Security</h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-between">
                <span>Change Password</span>
                <Eye className="w-4 h-4" />
              </Button>

              <Button variant="outline" className="w-full justify-between">
                <span>Two-Factor Authentication</span>
                <Lock className="w-4 h-4" />
              </Button>

              <Button variant="outline" className="w-full justify-between">
                <span>View Active Sessions</span>
              </Button>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-600 mb-4">Account Actions</h2>

            <div className="space-y-3">
              <Button
                onClick={handleLogout}
                className="w-full justify-start gap-3 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3 border-red-300 hover:bg-red-100">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span className="text-red-600">Delete Account</span>
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
