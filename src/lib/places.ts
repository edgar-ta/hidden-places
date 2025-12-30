import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy } from "firebase/firestore"
import type { Place } from "@/lib/types"

export async function getPlace(placeId: string): Promise<Place | null> {
  const placeRef = doc(db, "places", placeId)
  const placeSnap = await getDoc(placeRef)

  if (placeSnap.exists()) {
    return placeSnap.data() as Place
  }
  return null
}

export async function getPlacesBySeason(seasonId: string): Promise<Place[]> {
  const placesRef = collection(db, "places")
  const q = query(placesRef, where("season_id", "==", seasonId), where("valid", "==", true), orderBy("index", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Place)
}

export async function getAllPlaces(): Promise<Place[]> {
  const placesRef = collection(db, "places")
  const q = query(placesRef, where("valid", "==", true), orderBy("index", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Place)
}

export async function updatePlace(placeId: string, updates: Partial<Place>): Promise<void> {
  const placeRef = doc(db, "places", placeId)
  await setDoc(placeRef, updates, { merge: true })
}
