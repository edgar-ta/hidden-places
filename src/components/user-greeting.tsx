"use client"

import { useUser } from "@/components/user-provider"

const greetings = ["Hola", "¡Qué tal!", "¡Buen día!", "¡Hey!", "¡Saludos!", "¡Hola, hola!", "¿Qué onda?", "¡Buenas!"]

export function UserGreeting() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-lg border border-primary/20">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get a consistent greeting based on the current minute
  const greetingIndex = new Date().getMinutes() % greetings.length
  const greeting = greetings[greetingIndex]

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-lg border border-primary/20">
      <span className="text-lg font-medium text-primary">
        {greeting}, {user.name}
      </span>
    </div>
  )
}
