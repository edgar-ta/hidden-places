"use client"

import { useState } from "react"
import type { Season, Place, SerializedTimestamp } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Calendar, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SeasonManager } from "@/components/season-manager"
import { PlacesManager } from "@/components/places-manager"
import { PrizeVerification } from "@/components/prize-verification"
import { deserializeTimestampOfSeason } from "@/lib/seasons"
import { runOnNull } from "@/lib/utils"

interface AdminDashboardProps {
  serializedSeason: SerializedTimestamp<Season> | null
  places: Place[]
}

export function AdminDashboard({ serializedSeason, places: places }: AdminDashboardProps) {
  const season = runOnNull(deserializeTimestampOfSeason, serializedSeason);
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" })
      if (response.ok) {
        toast.success("Sesión cerrada")
        router.push("/administrador")
      }
    } catch (error) {
      toast.error("Error al cerrar sesión")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const prizePlaces = places.filter((p) => p.first_sightseeing_id !== null)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temporada Actual</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{season ? "Activa" : "Sin temporada"}</div>
              {season && (
                <p className="text-xs text-muted-foreground">
                  {season.start_date.toDate().toLocaleDateString()} - {season.end_date.toDate().toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Lugares</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{places.length}</div>
              <p className="text-xs text-muted-foreground">{places.filter((p) => p.valid).length} activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premios Ganados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prizePlaces.length}</div>
              <p className="text-xs text-muted-foreground">
                {prizePlaces.filter((p) => p.is_redeemed).length} reclamados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="season" className="space-y-4">
          <TabsList>
            <TabsTrigger value="season">Temporadas</TabsTrigger>
            <TabsTrigger value="places">Lugares</TabsTrigger>
            <TabsTrigger value="prizes">Verificar Premios</TabsTrigger>
          </TabsList>

          <TabsContent value="season" className="space-y-4">
            <SeasonManager season={season} />
          </TabsContent>

          <TabsContent value="places" className="space-y-4">
            <PlacesManager places={places} />
          </TabsContent>

          <TabsContent value="prizes" className="space-y-4">
            <PrizeVerification places={prizePlaces} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
