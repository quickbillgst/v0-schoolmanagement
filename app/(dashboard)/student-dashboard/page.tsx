"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Request {
  _id: string
  equipmentId: { name: string; category: string }
  status: "pending" | "approved" | "rejected" | "returned"
  requestDate: string
  dueDate: string
  returnDate?: string
  quantity?: number
  isOverdue?: boolean
  daysUntilDue?: number
}

export default function StudentDashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== "student" && user?.role !== "staff") {
      router.push("/dashboard")
      return
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (response.ok) {
          const allRequests = data.requests || data || []
          setRequests(Array.isArray(allRequests) ? allRequests : [])
        } else {
          throw new Error(data.message || "Failed to fetch requests")
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load requests",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchRequests()
  }, [token, user?.role, router, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "returned":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "returned":
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")
  const returnedRequests = requests.filter((r) => r.status === "returned")
  const overdueRequests = approvedRequests.filter((r) => r.isOverdue)

  const totalBorrowed = approvedRequests.length + returnedRequests.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">My Equipment Dashboard</h1>
        <p className="text-muted-foreground">Track your borrowing requests and equipment usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently borrowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalBorrowed}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Returned Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-600">{returnedRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully returned</p>
          </CardContent>
        </Card>
      </div>

      {overdueRequests.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">You have {overdueRequests.length} overdue item(s)!</span>
            <p className="text-sm mt-1">Please return them to avoid penalties.</p>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Active Loans</CardTitle>
          <Link href="/request/new">
            <Button size="sm">Borrow Equipment</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {approvedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You don't have any active loans.</p>
              <Link href="/dashboard">
                <Button variant="link" className="mt-2">
                  Browse available equipment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{request.equipmentId.name}</h3>
                    <p className="text-sm text-muted-foreground">Qty: {request.quantity || 1}</p>
                    <div className="text-sm mt-2">
                      <span className={`${request.isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>
                        Due: {new Date(request.dueDate).toLocaleDateString()}
                        {request.isOverdue && " (OVERDUE)"}
                        {request.daysUntilDue && !request.isOverdue && ` (${request.daysUntilDue} days left)`}
                      </span>
                    </div>
                  </div>
                  <Link href={`/request/${request._id}`}>
                    <Button size="sm" variant="outline">
                      Return
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No requests yet</div>
          ) : (
            <div className="space-y-2">
              {requests.map((request) => (
                <div key={request._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(request.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{request.equipmentId.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
