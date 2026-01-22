import type React from "react"
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "primary" | "green" | "yellow" | "red"
}

export function StatCard({ title, value, subtitle, icon, trend, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    green: "bg-green-100 text-green-600",
    yellow: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>{icon}</div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  )
}
