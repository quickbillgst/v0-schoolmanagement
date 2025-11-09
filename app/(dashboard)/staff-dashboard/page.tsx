"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Request {
  _id: string
  requesterId: { name: string; email: string }
  equipmentId: { name: string; category: string }
  status: "pending" | "approved" | "rejected" | "returned"
  requestDate: string
  dueDate: string
  quantity?: number
  isOverdue?: boolean
}

export default function StaffDashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filter, setFilter] = useState("pending")

  useEffect(() => {
    if (user?.role !== "staff" && user?.role !== "admin") {
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

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve request")
      }

      toast({
        title: "Success",
        description: "Request approved successfully",
      })
      setRequests(requests.map((r) => (r._id === requestId ? { ...r, status: "approved" } : r)))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reject request")
      }

      toast({
        title: "Success",
        description: "Request rejected",
      })
      setRequests(requests.map((r) => (r._id === requestId ? { ...r, status: "rejected" } : r)))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

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

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const overdueRequests = approvedRequests.filter((r) => r.isOverdue)
  const rejectedRequests = requests.filter((r) => r.status === "rejected")
  const returnedRequests = requests.filter((r) => r.status === "returned")

  const filteredRequests =
    filter === "pending"
      ? pendingRequests
      : filter === "approved"
        ? approvedRequests
        : filter === "overdue"
          ? overdueRequests
          : filter === "rejected"
            ? rejectedRequests
            : returnedRequests

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Staff Dashboard</h1>
        <p className="text-muted-foreground">Manage and approve equipment requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting your decision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently borrowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{overdueRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {overdueRequests.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">{overdueRequests.length} items are overdue!</span>
            <p className="text-sm mt-1">Click on overdue requests to take action</p>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Request Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Active" },
              { value: "overdue", label: "Overdue" },
              { value: "rejected", label: "Rejected" },
              { value: "returned", label: "Returned" },
            ].map((status) => (
              <Button
                key={status.value}
                variant={filter === status.value ? "default" : "outline"}
                onClick={() => setFilter(status.value)}
                size="sm"
              >
                {status.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No requests in this category</div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{request.equipmentId.name}</h3>
                      <p className="text-sm text-muted-foreground">Requested by: {request.requesterId.name}</p>
                      <p className="text-xs text-muted-foreground">{request.requesterId.email}</p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Category</span>
                      <p className="font-medium">{request.equipmentId.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantity</span>
                      <p className="font-medium">{request.quantity || 1}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Request Date</span>
                      <p className="font-medium">{new Date(request.requestDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date</span>
                      <p className={`font-medium ${request.isOverdue ? "text-red-600" : ""}`}>
                        {new Date(request.dueDate).toLocaleDateString()}
                        {request.isOverdue && " (OVERDUE)"}
                      </p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(request._id)}
                        disabled={processingId === request._id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(request._id)}
                        disabled={processingId === request._id}
                        size="sm"
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
