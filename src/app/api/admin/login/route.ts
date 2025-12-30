import { NextResponse } from "next/server"
import { adminLogin } from "@/app/actions/admin"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Credenciales requeridas" }, { status: 400 })
    }

    const result = await adminLogin(username, password)

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ success: false, error: "Error al iniciar sesión" }, { status: 500 })
  }
}
