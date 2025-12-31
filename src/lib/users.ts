import { db } from "@/lib/firebase"
import { collection, doc, getDoc, setDoc, query, where, getDocs, Timestamp, orderBy, limit } from "firebase/firestore"
import type { SerializedTimestamp, User } from "@/lib/types"

export async function createUser(name: string, deviceFingerprint: string, ipAddress?: string): Promise<User> {
  const usersRef = collection(db, "users")

  // Check for suspicious activity (rate limiting)
  const recentUsersQuery = query(
    usersRef,
    where("device_fingerprint", "==", deviceFingerprint),
    where("creation", ">", Timestamp.fromMillis(Date.now() - 3600000)), // Last hour
    limit(5),
  )

  const recentUsers = await getDocs(recentUsersQuery)

  if (recentUsers.size >= 3) {
    throw new Error("Too many registrations from this device")
  }

  // Get user count for generating name
  const allUsersQuery = query(usersRef, orderBy("creation", "desc"), limit(1))
  const allUsersSnapshot = await getDocs(allUsersQuery)

  let userIndex = 1
  if (!allUsersSnapshot.empty) {
    const lastUser = allUsersSnapshot.docs[0].data() as User
    const match = lastUser.name.match(/Usuario (\d+)/)
    if (match) {
      userIndex = Number.parseInt(match[1]) + 1
    }
  }

  const newDocRef = doc(usersRef)
  const user: User = {
    id: newDocRef.id,
    name: name || `Usuario ${userIndex}`,
    creation: Timestamp.now(),
    device_fingerprint: deviceFingerprint,
    ip_address: ipAddress,
    last_seen: Timestamp.now(),
  }

  await setDoc(newDocRef, user)
  return user
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data() as User
  }
  return null
}

export async function updateUserName(userId: string, newName: string): Promise<void> {
  const userRef = doc(db, "users", userId)
  await setDoc(userRef, { name: newName }, { merge: true })
}

export async function updateUserLastSeen(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId)
  await setDoc(userRef, { last_seen: Timestamp.now() }, { merge: true })
}

export function serializeTimestampOfUser(user: User): SerializedTimestamp<User> {
  return {
    ...user,
    creation: user.creation.toDate().toISOString(),
    last_seen: user.last_seen !== undefined? user.last_seen.toDate().toISOString(): undefined
  };
}

export function deserializeTimestampOfUser(user: SerializedTimestamp<User>): User {
  return {
    ...user,
    creation: Timestamp.fromDate(new Date(user.creation)),
    last_seen: user.last_seen !== undefined? Timestamp.fromDate(new Date(user.last_seen)): undefined
  }
}
