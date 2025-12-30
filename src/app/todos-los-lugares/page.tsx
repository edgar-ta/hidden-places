import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { getCurrentSeason } from "@/lib/seasons"
import { getPlacesBySeason } from "@/lib/places"
import { getUserSightseeings } from "@/lib/sightseeing"
import { AllPlacesClient } from "@/components/all-places-client"

export default async function AllPlacesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  const season = await getCurrentSeason()

  if (!season) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No hay temporada activa</h2>
          <p className="text-muted-foreground">Vuelve pronto para nuevos lugares</p>
        </div>
      </div>
    )
  }

  const places = await getPlacesBySeason(season.id)
  const sightseeings = await getUserSightseeings(user.id)
  const discoveredPlaceIds = new Set(sightseeings.map((s) => s.place_id))

  return <AllPlacesClient places={places} discoveredPlaceIds={discoveredPlaceIds} />
}
