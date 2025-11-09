"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"

interface Equipment {
  _id: string
  name: string
  category: string
  quantity: number
  availableQuantity: number
  condition: string
  description: string
}

interface BorrowRequest {
  _id: string
  equipmentId: { name: string }
  quantity: number
  dueDate: string
  status: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([])
  const [overdueItems, setOverdueItems] = useState<BorrowRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const categories = ["All", "Projector", "Laptop", "Microscope", "Camera", "Lab Equipment"]

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("/api/equipment", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          setEquipment(Array.isArray(data) ? data : [])
          setFilteredEquipment(Array.isArray(data) ? data : [])
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

    if (token) fetchEquipment()
  }, [token, toast])

  useEffect(() => {
    const fetchOverdueItems = async () => {
      try {
        const response = await fetch("/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        if (response.ok) {
          const requests = Array.isArray(data) ? data : []
          const now = new Date()
          const overdue = requests.filter(
            (req: BorrowRequest) => req.status === "approved" && new Date(req.dueDate) < now,
          )
          setOverdueItems(overdue)
        }
      } catch (error) {
        console.error("[v0] Error fetching overdue items:", error)
      }
    }

    if (token) fetchOverdueItems()
  }, [token])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    filterEquipment(value, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterEquipment(searchQuery, category)
  }

  const filterEquipment = (search: string, category: string) => {
    let filtered = equipment

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category && category !== "All") {
      filtered = filtered.filter((item) => item.category === category)
    }

    setFilteredEquipment(filtered)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground capitalize">You're logged in as a {user?.role}</p>
      </div>

      {overdueItems.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">You have {overdueItems.length} overdue item(s)!</span>
            <p className="text-sm mt-2">Please return them as soon as possible.</p>
            <div className="mt-3 space-y-2">
              {overdueItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-destructive/10 p-2 rounded">
                  <span>
                    {item.equipmentId.name} (Qty: {item.quantity})
                  </span>
                  <Link href={`/request/${item._id}`}>
                    <Button size="sm" variant="outline">
                      Return Now
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Equipment</CardTitle>
          <CardDescription>Search and filter available items to borrow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat || (cat === "All" && !selectedCategory) ? "default" : "outline"}
                  onClick={() => handleCategoryChange(cat === "All" ? "" : cat)}
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading equipment...</div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No equipment found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEquipment.map((item) => (
                <Card key={item._id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <p className="text-sm">{item.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Available:</span>
                        <span className="ml-1">{item.availableQuantity}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Total:</span>
                        <span className="ml-1">{item.quantity}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Condition:</span>
                        <span className="ml-1 capitalize">{item.condition}</span>
                      </div>
                    </div>
                    {(user?.role === "student" || user?.role === "staff") && (
                      <Link href={`/request/${item._id}`}>
                        <Button className="w-full mt-2" disabled={item.availableQuantity === 0}>
                          {item.availableQuantity === 0 ? "Out of Stock" : "Request"}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
