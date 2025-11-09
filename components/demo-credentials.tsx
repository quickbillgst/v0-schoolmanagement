"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const DEMO_CREDENTIALS = [
  {
    role: "Admin",
    email: "admin@school.com",
    password: "admin123",
    color: "bg-red-100 text-red-800",
  },
  {
    role: "Staff",
    email: "staff@school.com",
    password: "staff123",
    color: "bg-blue-100 text-blue-800",
  },
  {
    role: "Student",
    email: "student@school.com",
    password: "student123",
    color: "bg-green-100 text-green-800",
  },
]

export function DemoCredentials() {
  const { toast } = useToast()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast({
      description: "Copied to clipboard!",
      duration: 2000,
    })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Card className="border-2 border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Demo Credentials</CardTitle>
        <CardDescription>Use these test accounts to explore the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {DEMO_CREDENTIALS.map((cred, index) => (
          <div key={index} className="p-3 bg-background rounded-lg border space-y-2">
            <div className="flex items-center justify-between">
              <Badge className={cred.color}>{cred.role}</Badge>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{cred.email}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(cred.email, index)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Copy email"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-muted-foreground">Password: </span>
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{cred.password}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(cred.password, index)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Copy password"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
