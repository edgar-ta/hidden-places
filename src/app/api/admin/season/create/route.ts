import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { createNewSeason } from "@/app/actions/admin"

export async function POST(request: Request) {
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { startDate, endDate, name } = await request.json()
    await createNewSeason(new Date(startDate), new Date(endDate), name)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear" }, { status: 500 })
  }
}
