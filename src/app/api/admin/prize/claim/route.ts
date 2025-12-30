import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { markPrizeAsClaimed } from "@/app/actions/admin"

export async function POST(request: Request) {
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { placeId } = await request.json()
    await markPrizeAsClaimed(placeId)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error al reclamar" }, { status: 500 })
  }
}
