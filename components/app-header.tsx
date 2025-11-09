"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NotificationPanel } from "@/components/notification-panel"

export function AppHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold">
          Equipment Portal
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="hover:text-accent transition">
              Browse
            </Link>
            {user?.role === "admin" && (
              <>
                <Link href="/admin-dashboard" className="hover:text-accent transition">
                  Analytics
                </Link>
                <Link href="/equipment" className="hover:text-accent transition">
                  Equipment
                </Link>
              </>
            )}
            {user?.role === "staff" && (
              <>
                <Link href="/staff-dashboard" className="hover:text-accent transition">
                  Approvals
                </Link>
                <Link href="/all-requests" className="hover:text-accent transition">
                  All Requests
                </Link>
              </>
            )}
            {user?.role === "student" && (
              <>
                <Link href="/student-dashboard" className="hover:text-accent transition">
                  My Dashboard
                </Link>
                <Link href="/requests" className="hover:text-accent transition">
                  My Requests
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <NotificationPanel />

            <div className="text-sm">
              <div className="font-semibold">{user?.name}</div>
              <div className="text-xs opacity-75 capitalize">{user?.role}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
