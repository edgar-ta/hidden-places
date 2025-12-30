import { NextResponse } from "next/server"
import { ensureUserSession } from "@/app/actions/auth"

export async function POST(request: Request) {
  try {
    const { deviceFingerprint } = await request.json()

    if (!deviceFingerprint) {
      return NextResponse.json({ message: "Device fingerprint es requerido" }, { status: 400 })
    }

    // Get IP address from request headers
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || undefined

    const { user, isNew } = await ensureUserSession(deviceFingerprint, ipAddress)

    return NextResponse.json({ user, isNew }, { status: 200 })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error al crear sesión" },
      { status: 500 },
    )
  }
}
