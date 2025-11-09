"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Equipment {
  _id: string
  name: string
  category: string
  description: string
  availableQuantity: number
}

export default function RequestPage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [dueDate, setDueDate] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`/api/equipment`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          const found = data.find((item: Equipment) => item._id === params.id)
          setEquipment(found)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load equipment details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchEquipment()
  }, [token, params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const qty = Number.parseInt(quantity)
      if (qty < 1) {
        toast({
          title: "Invalid quantity",
          description: "Please enter at least 1 item",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (equipment && qty > equipment.availableQuantity) {
        toast({
          title: "Insufficient quantity",
          description: `Only ${equipment.availableQuantity} items available`,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipmentId: params.id,
          dueDate,
          quantity: qty,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create request")
      }

      toast({
        title: "Success",
        description: "Equipment request created successfully",
      })
      router.push("/requests")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">Loading...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Request Equipment</CardTitle>
          <CardDescription>Complete your equipment request</CardDescription>
        </CardHeader>
        <CardContent>
          {equipment ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{equipment.name}</h3>
                <p className="text-sm text-muted-foreground">{equipment.category}</p>
                <p className="text-sm text-muted-foreground mt-2">{equipment.description}</p>
                <p className="text-sm font-medium mt-2">Available: {equipment.availableQuantity} items</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={equipment.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center text-muted-foreground">Equipment not found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
