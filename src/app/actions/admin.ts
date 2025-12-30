"use server"

import { verifyAdminCredentials, setAdminSession, clearAdminSession } from "@/lib/admin-auth"
import { updatePlace } from "@/lib/places"
import { updateSeason, createSeason } from "@/lib/seasons"
import { Timestamp } from "firebase/firestore"

export async function adminLogin(username: string, password: string) {
  const isValid = await verifyAdminCredentials(username, password)

  if (!isValid) {
    return { success: false, error: "Credenciales inválidas" }
  }

  await setAdminSession()
  return { success: true }
}

export async function adminLogout() {
  await clearAdminSession()
  return { success: true }
}

export async function markPrizeAsClaimed(placeId: string) {
  await updatePlace(placeId, { is_redeemed: true })
  return { success: true }
}

export async function updatePlaceData(
  placeId: string,
  data: {
    name?: string
    description?: string
    pictures?: string[]
    prize?: string
    valid?: boolean
  },
) {
  await updatePlace(placeId, data)
  return { success: true }
}

export async function updateSeasonDates(seasonId: string, startDate: Date, endDate: Date) {
  await updateSeason(seasonId, {
    start_date: Timestamp.fromDate(startDate),
    end_date: Timestamp.fromDate(endDate),
  })
  return { success: true }
}

export async function createNewSeason(startDate: Date, endDate: Date, name?: string) {
  await createSeason(Timestamp.fromDate(startDate), Timestamp.fromDate(endDate), name)
  return { success: true }
}
