import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/actions/auth"
import { createSightseeing, getSightseeingCountForPlace } from "@/lib/sightseeing"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Usuario no autenticado" }, { status: 401 })
    }

    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json({ message: "Place ID es requerido" }, { status: 400 })
    }

    await createSightseeing(user.id, placeId)
    const position = await getSightseeingCountForPlace(placeId)

    return NextResponse.json({ success: true, position }, { status: 200 })
  } catch (error) {
    console.error("Create sightseeing error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error al crear registro" },
      { status: 500 },
    )
  }
}
