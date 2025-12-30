import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { updatePlaceData } from "@/app/actions/admin"

export async function POST(request: Request) {
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { placeId, ...data } = await request.json()
    await updatePlaceData(placeId, data)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}
