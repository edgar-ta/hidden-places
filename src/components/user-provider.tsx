"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAutoSignup } from "@/hooks/use-auto-signup"
import type { User } from "@/lib/types"

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, error, setUser } = useAutoSignup()

  return <UserContext.Provider value={{ user, isLoading, error, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
