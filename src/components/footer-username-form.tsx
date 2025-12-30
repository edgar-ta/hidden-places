"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/components/user-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Pencil } from "lucide-react"

export function FooterUsernameForm() {
  const { user, setUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || newName.trim() === user.name) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/user/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el nombre")
      }

      setUser({ ...user, name: newName.trim() })
      toast.success("Nombre actualizado correctamente")
      setIsEditing(false)
      setNewName("")
    } catch (error) {
      toast.error("Error al actualizar el nombre")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      {!isEditing ? (
        <button
          onClick={() => {
            setIsEditing(true)
            setNewName(user.name)
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Cambiar nombre de usuario
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Label htmlFor="username" className="text-sm">
            Nuevo nombre
          </Label>
          <div className="flex gap-2">
            <Input
              id="username"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={user.name}
              maxLength={30}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} size="sm">
              Guardar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setNewName("")
              }}
              disabled={isLoading}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
