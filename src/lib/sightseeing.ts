import { db } from "@/lib/firebase"
import { collection, doc, getDocs, setDoc, query, where, orderBy, Timestamp, limit } from "firebase/firestore"
import type { SerializedTimestamp, Sightseeing } from "@/lib/types"
import { updatePlace } from "./places"

export async function createSightseeing(userId: string, placeId: string): Promise<Sightseeing> {
  const sightseeingRef = collection(db, "sightseeings")
  const newDocRef = doc(sightseeingRef)

  const sightseeing: Sightseeing = {
    id: newDocRef.id,
    user_id: userId,
    place_id: placeId,
    creation: Timestamp.now(),
  }

  await setDoc(newDocRef, sightseeing)

  // Check if this is the first sightseeing for this place
  const firstSightseeingQuery = query(
    sightseeingRef,
    where("place_id", "==", placeId),
    orderBy("creation", "asc"),
    limit(1),
  )

  const firstSnapshot = await getDocs(firstSightseeingQuery)
  if (!firstSnapshot.empty && firstSnapshot.docs[0].id === sightseeing.id) {
    // This is the first sightseeing, update the place
    await updatePlace(placeId, {
      first_sightseeing_id: sightseeing.id,
    })
  }

  return sightseeing
}

export async function getSightseeingByUserAndPlace(userId: string, placeId: string): Promise<Sightseeing | null> {
  const sightseeingRef = collection(db, "sightseeings")
  const q = query(sightseeingRef, where("user_id", "==", userId), where("place_id", "==", placeId), limit(1))

  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as Sightseeing
  }
  return null
}

export async function getUserSightseeings(userId: string): Promise<Sightseeing[]> {
  const sightseeingRef = collection(db, "sightseeings")
  const q = query(sightseeingRef, where("user_id", "==", userId), orderBy("creation", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Sightseeing)
}

export async function getSightseeingCountForPlace(placeId: string): Promise<number> {
  const sightseeingRef = collection(db, "sightseeings")
  const q = query(sightseeingRef, where("place_id", "==", placeId))

  const querySnapshot = await getDocs(q)
  return querySnapshot.size
}

export function serializeTimestampOfSightseeing(sightseeing: Sightseeing): SerializedTimestamp<Sightseeing> {
  return {
    ...sightseeing,
    creation: sightseeing.creation.toDate().toISOString()
  }
}

export function deserializeTimestampOfSightseeing(sightseeing: SerializedTimestamp<Sightseeing>): Sightseeing {
  return {
    ...sightseeing,
    creation: Timestamp.fromDate(new Date(sightseeing.creation))
  }
}
