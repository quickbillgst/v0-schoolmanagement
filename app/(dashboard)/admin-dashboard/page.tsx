"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import Link from "next/link"

interface AnalyticsData {
  stats: {
    totalEquipment: number
    totalUsers: number
    totalRequests: number
    approvedRequests: number
    pendingRequests: number
    rejectedRequests: number
    returnedRequests: number
    overdueItems: number
    maintenanceItems: number
    overduePercentage: number
  }
  charts: {
    categoryUsage: Array<{ _id: string; count: number }>
    frequentlyBorrowed: Array<{ name: string; count: number }>
    monthlyTrend: Array<{ month: string; count: number }>
    usersByRole: Array<{ _id: string; count: number }>
  }
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function AdminDashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (response.ok) {
          setAnalytics(data)
        } else {
          throw new Error(data.message || "Failed to fetch analytics")
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load analytics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchAnalytics()
  }, [token, user?.role, router, toast])

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-8 text-muted-foreground">Failed to load analytics</div>
  }

  const { stats, charts } = analytics

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System-wide analytics and key metrics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/equipment">
            <Button>Add Equipment</Button>
          </Link>
          <Button variant="outline" onClick={() => window.print()}>
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.maintenanceItems} under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.approvedRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.overdueItems} overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.overduePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Of approved loans</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category-wise Equipment Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.categoryUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Borrow Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Approved", value: stats.approvedRequests },
                    { name: "Pending", value: stats.pendingRequests },
                    { name: "Rejected", value: stats.rejectedRequests },
                    { name: "Returned", value: stats.returnedRequests },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Frequently Borrowed Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {charts.frequentlyBorrowed.length === 0 ? (
                <p className="text-muted-foreground text-sm">No borrowing data available</p>
              ) : (
                charts.frequentlyBorrowed.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{item.name}</span>
                    <Badge variant="secondary">{item.count} times</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">Approved</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">Rejected</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.returnedRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">Returned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Link href="/all-requests">
          <Button>View All Requests</Button>
        </Link>
        <Link href="/equipment">
          <Button variant="outline">Manage Equipment</Button>
        </Link>
      </div>
    </div>
  )
}
