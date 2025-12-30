import { notFound } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { getPlace } from "@/lib/places"
import { getSeason, getSeasonStatus } from "@/lib/seasons"
import { getSightseeingByUserAndPlace, getSightseeingCountForPlace } from "@/lib/sightseeing"
import { PlaceDiscoveryClient } from "@/components/place-discovery-client"

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const place = await getPlace(id)

  if (!place || !place.valid) {
    return notFound()
  }

  const season = await getSeason(place.season_id)

  if (!season) {
    return notFound()
  }

  const seasonStatus = getSeasonStatus(season)
  const existingSightseeing = await getSightseeingByUserAndPlace(user.id, place.id)
  const sightseeingCount = await getSightseeingCountForPlace(place.id)
  const isFirstVisitor = place.first_sightseeing_id === null
  const hasWonPrize = place.first_sightseeing_id === existingSightseeing?.id

  return (
    <PlaceDiscoveryClient
      place={place}
      season={season}
      seasonStatus={seasonStatus}
      user={user}
      existingSightseeing={existingSightseeing}
      sightseeingCount={sightseeingCount}
      isFirstVisitor={isFirstVisitor}
      hasWonPrize={hasWonPrize}
    />
  )
}
