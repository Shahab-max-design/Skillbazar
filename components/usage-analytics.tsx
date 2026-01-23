"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const usageData = [
  { month: "Jan", digital: 4, onsite: 2 },
  { month: "Feb", digital: 3, onsite: 5 },
  { month: "Mar", digital: 5, onsite: 3 },
  { month: "Apr", digital: 6, onsite: 4 },
  { month: "May", digital: 4, onsite: 6 },
  { month: "Jun", digital: 7, onsite: 5 },
]

export function UsageAnalytics() {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg text-foreground mb-4">Usage Analytics</h3>
      <p className="text-sm text-muted-foreground mb-4">Services used over the last 6 months</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={usageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="digital" fill="#10b981" name="Digital Services" />
          <Bar dataKey="onsite" fill="#059669" name="Onsite Services" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
