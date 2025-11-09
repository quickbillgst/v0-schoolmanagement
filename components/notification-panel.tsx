"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Bell, Check, AlertCircle, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  isRead: boolean
  daysUntilDue: number | null
  createdAt: string
}

export function NotificationPanel() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = async () => {
    if (!token) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch notifications")

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error: any) {
      console.error("[v0] Error fetching notifications:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [token])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notificationId,
          isRead: true,
        }),
      })

      setNotifications(notifications.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n)))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error("[v0] Error marking notification as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "overdue-alert":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case "due-date-reminder":
        return <Clock className="w-4 h-4 text-orange-500" />
      default:
        return <Check className="w-4 h-4 text-green-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              className={cn("flex flex-col gap-2 p-4 cursor-pointer", !notification.isRead && "bg-accent/50")}
              onClick={() => handleMarkAsRead(notification._id)}
            >
              <div className="flex items-start justify-between w-full gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
                {!notification.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
