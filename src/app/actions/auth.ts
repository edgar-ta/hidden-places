"use server"

import { cookies } from "next/headers"
import { createUser, getUser, updateUserLastSeen } from "@/lib/users"

const USER_COOKIE_NAME = "hidden_places_user_id"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export async function ensureUserSession(deviceFingerprint: string, ipAddress?: string) {
  const cookieStore = await cookies()
  const existingUserId = cookieStore.get(USER_COOKIE_NAME)?.value

  if (existingUserId) {
    // User exists, fetch their data
    const user = await getUser(existingUserId)
    if (user) {
      // Update last seen
      await updateUserLastSeen(user.id)
      return { user, isNew: false }
    }
  }

  // Create new user
  try {
    const user = await createUser("", deviceFingerprint, ipAddress)
    cookieStore.set(USER_COOKIE_NAME, user.id, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    return { user, isNew: true }
  } catch (error) {
    if (error instanceof Error && error.message === "Too many registrations from this device") {
      throw new Error("Demasiados registros desde este dispositivo. Por favor, intenta más tarde.")
    }
    throw error
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get(USER_COOKIE_NAME)?.value

  if (!userId) {
    return null
  }

  const user = await getUser(userId)
  return user
}

export async function updateCurrentUserName(newName: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get(USER_COOKIE_NAME)?.value

  if (!userId) {
    throw new Error("Usuario no encontrado")
  }

  const { updateUserName } = await import("@/lib/users")
  await updateUserName(userId, newName)

  return { success: true }
}
