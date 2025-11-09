"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Request {
  _id: string
  requesterId: { name: string; email: string }
  equipmentId: { name: string; category: string }
  status: "pending" | "approved" | "rejected" | "returned"
  requestDate: string
  dueDate: string
  quantity?: number
}

export default function AllRequestsPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "staff") {
      return
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          setRequests(Array.isArray(data) ? data : data.data || [])
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

    fetchRequests()
  }, [token, user?.role, toast])

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

  const handleReturn = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "returned" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark as returned")
      }

      toast({
        title: "Success",
        description: "Equipment marked as returned",
      })
      setRequests(requests.map((r) => (r._id === requestId ? { ...r, status: "returned" } : r)))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark as returned",
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

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Equipment Requests</h1>
        <p className="text-muted-foreground">Manage and approve borrowing requests</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected", "returned"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            size="sm"
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">No requests found</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request._id}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle>{request.equipmentId.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Requested by: {request.requesterId.name}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Category</span>
                    <p className="font-semibold">{request.equipmentId.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Request Date</span>
                    <p className="font-semibold">{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <p className="font-semibold">{new Date(request.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <p className="font-semibold">{request.quantity || 1}</p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">Requester Email:</span> {request.requesterId.email}
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(request._id)}
                      disabled={processingId === request._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(request._id)}
                      disabled={processingId === request._id}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {request.status === "approved" && (
                  <Button
                    onClick={() => handleReturn(request._id)}
                    disabled={processingId === request._id}
                    variant="outline"
                  >
                    Mark as Returned
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
