import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, setDoc, query, orderBy, limit, Timestamp } from "firebase/firestore"
import type { Season, SeasonStatus } from "@/lib/types"

export async function getCurrentSeason(): Promise<Season | null> {
  const seasonsRef = collection(db, "seasons")
  const q = query(seasonsRef, orderBy("start_date", "desc"), limit(1))

  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as Season
  }
  return null
}

export async function getSeason(seasonId: string): Promise<Season | null> {
  const seasonRef = doc(db, "seasons", seasonId)
  const seasonSnap = await getDoc(seasonRef)

  if (seasonSnap.exists()) {
    return seasonSnap.data() as Season
  }
  return null
}

export function getSeasonStatus(season: Season): SeasonStatus {
  const now = Timestamp.now()

  if (now.toMillis() < season.start_date.toMillis()) {
    return "not-started"
  } else if (now.toMillis() > season.end_date.toMillis()) {
    return "expired"
  } else {
    return "active"
  }
}

export async function updateSeason(seasonId: string, updates: Partial<Season>): Promise<void> {
  const seasonRef = doc(db, "seasons", seasonId)
  await setDoc(seasonRef, updates, { merge: true })
}

export async function createSeason(startDate: Timestamp, endDate: Timestamp, name?: string): Promise<Season> {
  const seasonsRef = collection(db, "seasons")
  const newDocRef = doc(seasonsRef)

  const season: Season = {
    id: newDocRef.id,
    start_date: startDate,
    end_date: endDate,
    name,
  }

  await setDoc(newDocRef, season)
  return season
}
