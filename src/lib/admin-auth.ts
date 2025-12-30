import { cookies } from "next/headers"

const ADMIN_COOKIE_NAME = "hidden_places_admin"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD

  return username === validUsername && password === validPassword
}

export async function setAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME)
  return adminCookie?.value === "authenticated"
}
