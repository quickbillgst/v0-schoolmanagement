"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Equipment {
  _id: string
  name: string
  category: string
  quantity: number
  availableQuantity: number
  condition: string
  description: string
}

export default function EquipmentPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    condition: "good",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    const fetchEquipment = async () => {
      try {
        const response = await fetch("/api/equipment", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          setEquipment(Array.isArray(data) ? data : data.data || [])
        } else {
          throw new Error(data.message || "Failed to fetch equipment")
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load equipment",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEquipment()
  }, [token, user?.role, router, toast])

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number.parseInt(formData.quantity),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add equipment")
      }

      toast({
        title: "Success",
        description: "Equipment added successfully",
      })
      setEquipment([...equipment, data.data])
      setFormData({
        name: "",
        category: "",
        quantity: "",
        condition: "good",
        description: "",
      })
      setShowAddForm(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return

    try {
      const response = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete equipment")
      }

      toast({
        title: "Success",
        description: "Equipment deleted successfully",
      })
      setEquipment(equipment.filter((e) => e._id !== id))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment Management</h1>
          <p className="text-muted-foreground">Manage school equipment inventory</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "Add Equipment"}</Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Equipment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : equipment.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">No equipment added yet</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => (
            <Card key={item._id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-semibold">Category:</span> {item.category}
                  </p>
                  <p>
                    <span className="font-semibold">Available:</span> {item.availableQuantity}/{item.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Condition:</span>
                    <Badge className="ml-2 capitalize">{item.condition}</Badge>
                  </p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEquipment(item._id)}
                  className="w-full"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
