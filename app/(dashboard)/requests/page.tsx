"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Request {
  _id: string
  equipmentId: { name: string; category: string }
  status: "pending" | "approved" | "rejected" | "returned"
  requestDate: string
  dueDate: string
  returnDate?: string
  quantity?: number
}

export default function RequestsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          setRequests(Array.isArray(data) ? data : [])
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
  }, [token, toast])

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Requests</h1>
        <p className="text-muted-foreground">View and manage your equipment requests</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading requests...</div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">No requests yet</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{request.equipmentId.name}</CardTitle>
                    <CardDescription>{request.equipmentId.category}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <p className="font-semibold">{request.quantity || 1}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Request Date</span>
                    <p className="font-semibold">{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <p className="font-semibold">{new Date(request.dueDate).toLocaleDateString()}</p>
                  </div>
                  {request.returnDate && (
                    <div>
                      <span className="text-sm text-muted-foreground">Return Date</span>
                      <p className="font-semibold">{new Date(request.returnDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
