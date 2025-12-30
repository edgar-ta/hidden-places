"use client"

import { useState } from "react"
import type { Season } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface SeasonManagerProps {
  season: Season | null
}

export function SeasonManager({ season }: SeasonManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState(season ? season.start_date.toDate().toISOString().split("T")[0] : "")
  const [endDate, setEndDate] = useState(season ? season.end_date.toDate().toISOString().split("T")[0] : "")

  const handleUpdate = async () => {
    if (!season || !startDate || !endDate) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/season/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seasonId: season.id,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        }),
      })

      if (response.ok) {
        toast.success("Temporada actualizada")
        router.refresh()
      } else {
        toast.error("Error al actualizar temporada")
      }
    } catch (error) {
      toast.error("Error al actualizar temporada")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!startDate || !endDate) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/season/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        }),
      })

      if (response.ok) {
        toast.success("Temporada creada")
        router.refresh()
      } else {
        toast.error("Error al crear temporada")
      }
    } catch (error) {
      toast.error("Error al crear temporada")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Temporadas</CardTitle>
        <CardDescription>Configura las fechas de inicio y fin de las temporadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Fecha de Inicio</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Fecha de Fin</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex gap-2">
          {season ? (
            <Button onClick={handleUpdate} disabled={isLoading}>
              Actualizar Temporada
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={isLoading}>
              Crear Temporada
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
