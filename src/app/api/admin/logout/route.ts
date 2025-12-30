import { NextResponse } from "next/server"
import { adminLogout } from "@/app/actions/admin"

export async function POST() {
  try {
    await adminLogout()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
