"use client"
import { toast } from "sonner"

interface ToastNotificationProps {
  type: "success" | "error" | "info"
  message: string
  duration?: number
}

export function useToastNotification() {
  const showNotification = ({ type, message, duration = 5000 }: ToastNotificationProps) => {
    switch (type) {
      case "success":
        toast.success(message, { duration })
        break
      case "error":
        toast.error(message, { duration })
        break
      case "info":
        toast.info(message, { duration })
        break
    }
  }

  return { showNotification }
}
