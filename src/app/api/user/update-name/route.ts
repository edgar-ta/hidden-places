import { NextResponse } from "next/server"
import { updateCurrentUserName } from "@/app/actions/auth"

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ message: "Nombre inválido" }, { status: 400 })
    }

    if (name.trim().length > 30) {
      return NextResponse.json({ message: "El nombre es demasiado largo" }, { status: 400 })
    }

    await updateCurrentUserName(name.trim())

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Update name error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error al actualizar nombre" },
      { status: 500 },
    )
  }
}
