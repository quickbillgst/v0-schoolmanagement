"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { AlertCircle, CheckCircle2, Upload, Trash2, FileJson } from "lucide-react"

interface SeedResult {
  inserted: { users: number; equipment: number; requests: number }
  skipped: { users: number; equipment: number; requests: number }
  errors: string[]
}

export default function SeederPage() {
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [results, setResults] = useState<SeedResult | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".json")) {
        toast.error("Please select a JSON file")
        return
      }
      setFile(selectedFile)
      toast.success(`File selected: ${selectedFile.name}`)
    }
  }

  const loadDefaultData = async () => {
    setLoading(true)
    setProgress(0)
    setResults(null)

    try {
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90))
      }, 200)

      const response = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      clearInterval(interval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to seed data")
        setResults(null)
        return
      }

      const data = await response.json()
      setResults(data.data)
      toast.success("Dummy data loaded successfully!")
    } catch (error) {
      toast.error("Error loading dummy data")
      console.error(error)
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const loadCustomData = async () => {
    if (!file) {
      toast.error("Please select a JSON file first")
      return
    }

    setLoading(true)
    setProgress(0)
    setResults(null)

    try {
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90))
      }, 200)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      clearInterval(interval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to seed data")
        setResults(null)
        return
      }

      const data = await response.json()
      setResults(data.data)
      toast.success("Custom data loaded successfully!")
    } catch (error) {
      toast.error("Error loading custom data")
      console.error(error)
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const resetDatabase = async () => {
    const confirmed = window.confirm(
      "⚠️ This will permanently delete ALL data from the database. Are you sure? Type 'DELETE' in the next prompt to confirm.",
    )

    if (!confirmed) return

    const userInput = window.prompt('Enter "DELETE" to confirm database reset:')
    if (userInput !== "DELETE") {
      toast.error("Database reset cancelled")
      return
    }

    setResetLoading(true)

    try {
      const response = await fetch("/api/admin/reset?confirm=yes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to reset database")
        return
      }

      toast.success("Database reset successfully!")
      setResults(null)
      setFile(null)
    } catch (error) {
      toast.error("Error resetting database")
      console.error(error)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Database Seeder</h1>
          <p className="text-muted-foreground">Load sample data into the database for testing and demos</p>
        </div>

        {/* Load Default Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Load Default Dummy Data
            </CardTitle>
            <CardDescription>Load predefined sample users, equipment, and requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will load 5 sample users (admin, staff, students), 8 equipment items, and create sample data for
              testing.
            </p>
            <Button onClick={loadDefaultData} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Loading...
                </>
              ) : (
                "Load Default Data"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Load Custom Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Load Custom Data
            </CardTitle>
            <CardDescription>Upload your own JSON file with custom seed data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input type="file" accept=".json" onChange={handleFileSelect} disabled={loading} className="flex-1" />
            </div>
            {file && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">File Selected</AlertTitle>
                <AlertDescription className="text-green-800">{file.name}</AlertDescription>
              </Alert>
            )}
            <Button onClick={loadCustomData} disabled={loading || !file} className="w-full" size="lg">
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Loading...
                </>
              ) : (
                "Load Custom Data"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        {progress > 0 && (
          <Card>
            <CardContent className="pt-6">
              <Progress value={progress} className="h-2" />
              <p className="mt-2 text-center text-sm text-muted-foreground">{progress}% complete</p>
            </CardContent>
          </Card>
        )}

        {/* Results Card */}
        {results && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle2 className="h-5 w-5" />
                Seeding Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-green-900">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Inserted</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Users: {results.inserted.users}</li>
                    <li>Equipment: {results.inserted.equipment}</li>
                    <li>Requests: {results.inserted.requests}</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Skipped (Already Exists)</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Users: {results.skipped.users}</li>
                    <li>Equipment: {results.skipped.equipment}</li>
                    <li>Requests: {results.skipped.requests}</li>
                  </ul>
                </div>
              </div>

              {results.errors.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-900">Errors During Seeding</AlertTitle>
                  <AlertDescription className="mt-2 space-y-1 text-sm text-red-800">
                    {results.errors.map((error, i) => (
                      <div key={i}>• {error}</div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reset Database Card */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-800">Reset the entire database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-red-800">
              This will permanently delete all users, equipment, and requests. This action cannot be undone.
            </p>
            <Button onClick={resetDatabase} disabled={resetLoading} variant="destructive" className="w-full" size="lg">
              {resetLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                  Resetting...
                </>
              ) : (
                "Reset Database"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>JSON Format Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Expected JSON Structure:</h3>
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                {`{
  "users": [
    {
      "name": "John Doe",
      "email": "john@school.edu",
      "password": "SecurePass123",
      "role": "student"
    }
  ],
  "equipment": [
    {
      "name": "Microscope",
      "category": "lab",
      "condition": "excellent",
      "quantity": 5,
      "description": "..."
    }
  ],
  "requests": [
    {
      "requesterEmail": "john@school.edu",
      "equipmentName": "Microscope",
      "quantity": 1,
      "status": "pending"
    }
  ]
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
