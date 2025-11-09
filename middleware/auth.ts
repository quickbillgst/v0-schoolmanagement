import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }
    // Attach decoded token to request
    ;(request as any).user = decoded
    return handler(request)
  }
}

export function withRole(...allowedRoles: string[]) {
  return (handler: Function) => {
    return async (request: NextRequest) => {
      const token = getTokenFromRequest(request)
      if (!token) {
        return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
      }

      const decoded: any = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
      }

      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ success: false, message: "Insufficient permissions" }, { status: 403 })
      }
      ;(request as any).user = decoded
      return handler(request)
    }
  }
}
