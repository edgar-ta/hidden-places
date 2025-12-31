import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { getCurrentSeason, serializeTimestampOfSeason } from "@/lib/seasons"
import { getAllPlaces } from "@/lib/places"
import { AdminDashboard } from "@/components/admin-dashboard"
import { runOnNull } from "@/lib/utils"

export default async function AdminDashboardPage() {
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    redirect("/administrador")
  }

  const season = await getCurrentSeason()
  const places = await getAllPlaces()

  return <AdminDashboard 
    serializedSeason={runOnNull(serializeTimestampOfSeason, season)} 
    places={places} />
}
