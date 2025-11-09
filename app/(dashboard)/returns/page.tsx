"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Request {
  _id: string
  requesterId: { name: string; email: string }
  equipmentId: { name: string }
  status: "pending" | "approved" | "rejected" | "returned"
  dueDate: string
  returnDate?: string
}

export default function ReturnsPage() {
  const { user, token } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "staff") {
      return
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setRequests(data)
        }
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [token, user?.role])

  const handleMarkReturned = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "returned" }),
      })

      if (response.ok) {
        setRequests(requests.map((r) => (r._id === requestId ? { ...r, status: "returned" } : r)))
      }
    } catch (error) {
      console.error("Error marking returned:", error)
    }
  }

  const approvedRequests = requests.filter((r) => r.status === "approved")
  const overdueRequests = approvedRequests.filter((r) => new Date(r.dueDate) < new Date() && !r.returnDate)
  const returnedRequests = requests.filter((r) => r.status === "returned")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Return Tracking</h1>
        <p className="text-muted-foreground">Track and manage equipment returns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{overdueRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Returned Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{returnedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Borrowings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : approvedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No active borrowings</div>
          ) : (
            <div className="space-y-4">
              {approvedRequests.map((request) => {
                const isOverdue = new Date(request.dueDate) < new Date()
                return (
                  <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{request.equipmentId.name}</p>
                      <p className="text-sm text-muted-foreground">Borrowed by: {request.requesterId.name}</p>
                      <p className={`text-sm ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                        Due: {new Date(request.dueDate).toLocaleDateString()}
                        {isOverdue && " (OVERDUE)"}
                      </p>
                    </div>
                    <Button onClick={() => handleMarkReturned(request._id)} className="bg-green-600 hover:bg-green-700">
                      Mark Returned
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Returned</CardTitle>
        </CardHeader>
        <CardContent>
          {returnedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No returned items</div>
          ) : (
            <div className="space-y-4">
              {returnedRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{request.equipmentId.name}</p>
                    <p className="text-sm text-muted-foreground">Returned by: {request.requesterId.name}</p>
                    {request.returnDate && (
                      <p className="text-sm text-muted-foreground">
                        Returned: {new Date(request.returnDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge>Returned</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
