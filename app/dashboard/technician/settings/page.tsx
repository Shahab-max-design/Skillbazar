"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/hooks/use-user"
import { ArrowLeft, Bell, Lock, Shield, Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function TechnicianSettingsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobNotifications: true,
    messageNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    profilePublic: true,
  })
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPassword(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSavePassword = () => {
    if (password.new !== password.confirm) {
      alert("New passwords do not match")
      return
    }
    alert("Password updated successfully")
    setPassword({ current: "", new: "", confirm: "" })
  }

  const handleSaveSettings = () => {
    alert("Settings saved successfully")
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar type="technician" />

      <div className="lg:ml-64">
        <DashboardHeader 
          title="Settings" 
          userName={user?.name || "Technician"} 
          userRole="Onsite Technician" 
        />

        <main className="p-4 lg:p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and security</p>
          </div>

          <div className="grid gap-6 max-w-2xl">
            {/* Notification Settings */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Checkbox
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle("emailNotifications")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Job Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified about new jobs</p>
                  </div>
                  <Checkbox
                    checked={settings.jobNotifications}
                    onCheckedChange={() => handleToggle("jobNotifications")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Message Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when customers message</p>
                  </div>
                  <Checkbox
                    checked={settings.messageNotifications}
                    onCheckedChange={() => handleToggle("messageNotifications")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive tips and promotions</p>
                  </div>
                  <Checkbox
                    checked={settings.marketingEmails}
                    onCheckedChange={() => handleToggle("marketingEmails")}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="w-full mt-6">
                Save Notification Settings
              </Button>
            </div>

            {/* Security Settings */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Security</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </h3>

                  <div>
                    <Label htmlFor="current" className="text-sm font-medium mb-2 block">
                      Current Password
                    </Label>
                    <Input
                      id="current"
                      name="current"
                      type="password"
                      value={password.current}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new" className="text-sm font-medium mb-2 block">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new"
                        name="new"
                        type={showPassword ? "text" : "password"}
                        value={password.new}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        className="rounded-lg pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm" className="text-sm font-medium mb-2 block">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm"
                      name="confirm"
                      type="password"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="rounded-lg"
                    />
                  </div>

                  <Button onClick={handleSavePassword} variant="default" className="w-full">
                    Update Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security</p>
                  </div>
                  <Checkbox
                    checked={settings.twoFactorAuth}
                    onCheckedChange={() => handleToggle("twoFactorAuth")}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Privacy</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Public Profile</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to customers</p>
                  </div>
                  <Checkbox
                    checked={settings.profilePublic}
                    onCheckedChange={() => handleToggle("profilePublic")}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} variant="outline" className="w-full mt-6">
                Save Privacy Settings
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="bg-background border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">
                These actions cannot be undone.
              </p>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
