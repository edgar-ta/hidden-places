import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { getCurrentSeason } from "@/lib/seasons"
import { getAllPlaces } from "@/lib/places"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminDashboardPage() {
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    redirect("/administrador")
  }

  const season = await getCurrentSeason()
  const places = await getAllPlaces()

  return <AdminDashboard season={season} places={places} />
}
