"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Database } from "lucide-react"

export function SeedDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSeed = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ useDefault: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed database")
      }

      toast({
        title: "Database Seeded Successfully",
        description: `Added ${data.summary.inserted} records (Skipped: ${data.summary.skipped})`,
        duration: 4000,
      })
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSeed}
      disabled={isLoading}
      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      size="lg"
    >
      <Database className="mr-2 h-5 w-5" />
      {isLoading ? "Seeding Database..." : "Load Demo Data"}
    </Button>
  )
}
