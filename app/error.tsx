"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Error caught:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <AlertTriangle className="w-20 h-20 text-destructive mx-auto opacity-50" />
        <div>
          <h1 className="text-4xl font-bold mb-2">Oops! Something went wrong</h1>
          <p className="text-muted-foreground text-lg mb-2">We encountered an unexpected error. Please try again.</p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-sm text-destructive/70 font-mono mt-4 bg-destructive/5 p-3 rounded">{error.message}</p>
          )}
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
