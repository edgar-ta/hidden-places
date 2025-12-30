import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { getUserSightseeings } from "@/lib/sightseeing"
import { getPlace } from "@/lib/places"
import { PrizesClient } from "@/components/prizes-client"
import type { Place } from "@/lib/types"

export default async function PrizesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  const sightseeings = await getUserSightseeings(user.id)

  // Get places where user won prizes
  const prizePlaces: Place[] = []
  for (const sightseeing of sightseeings) {
    const place = await getPlace(sightseeing.place_id)
    if (place && place.first_sightseeing_id === sightseeing.id) {
      prizePlaces.push(place)
    }
  }

  return <PrizesClient prizes={prizePlaces} />
}
