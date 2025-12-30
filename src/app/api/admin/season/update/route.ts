import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { updateSeasonDates } from "@/app/actions/admin"

export async function POST(request: Request) {
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { seasonId, startDate, endDate } = await request.json()
    await updateSeasonDates(seasonId, new Date(startDate), new Date(endDate))
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}
