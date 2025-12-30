"use client"

import { useEffect, useState } from "react"
import { generateDeviceFingerprint } from "@/lib/device-fingerprint"
import type { User } from "@/lib/types"

export function useAutoSignup() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initUser() {
      try {
        const deviceFingerprint = generateDeviceFingerprint()

        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceFingerprint }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Error al inicializar sesión")
        }

        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    initUser()
  }, [])

  return { user, isLoading, error, setUser }
}
