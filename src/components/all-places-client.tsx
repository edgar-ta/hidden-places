"use client"

import { useState } from "react"
import type { Place } from "@/lib/types"
import { UserGreeting } from "@/components/user-greeting"
import { AppFooter } from "@/components/app-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface AllPlacesClientProps {
  places: Place[]
  discoveredPlaceIds: Set<string>
}

type FilterType = "all" | "found" | "not-found"

export function AllPlacesClient({ places, discoveredPlaceIds }: AllPlacesClientProps) {
  const [filter, setFilter] = useState<FilterType>("all")

  const filteredPlaces = places.filter((place) => {
    if (filter === "found") return discoveredPlaceIds.has(place.id)
    if (filter === "not-found") return !discoveredPlaceIds.has(place.id)
    return true
  })

  const foundCount = places.filter((p) => discoveredPlaceIds.has(p.id)).length

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-6">
        <div className="container max-w-6xl mx-auto">
          <UserGreeting />
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Todos los Lugares</h1>
            <p className="text-muted-foreground">
              Explora todos los lugares ocultos de la temporada actual. Has encontrado {foundCount} de {places.length}{" "}
              lugares.
            </p>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${(foundCount / places.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
              Todos ({places.length})
            </Button>
            <Button variant={filter === "found" ? "default" : "outline"} onClick={() => setFilter("found")} size="sm">
              Encontrados ({foundCount})
            </Button>
            <Button
              variant={filter === "not-found" ? "default" : "outline"}
              onClick={() => setFilter("not-found")}
              size="sm"
            >
              Sin encontrar ({places.length - foundCount})
            </Button>
          </div>

          {/* Places Grid */}
          {filteredPlaces.length === 0 ? (
            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No hay lugares en esta categoría</h3>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPlaces.map((place) => {
                const isDiscovered = discoveredPlaceIds.has(place.id)

                return (
                  <Card
                    key={place.id}
                    className={`border-2 transition-all ${
                      isDiscovered ? "hover:border-primary/50" : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Link href={isDiscovered ? `/lugar/${place.id}` : "#"} className="block">
                      <CardContent className="pt-6">
                        {isDiscovered ? (
                          <div className="space-y-4">
                            {place.pictures[0] && (
                              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={place.pictures[0] || "/placeholder.svg"}
                                  alt={place.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-lg font-semibold">{place.name}</h3>
                                <Badge variant="secondary">#{place.index}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
                              <div className="flex items-center gap-2 text-sm text-primary pt-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Descubierto</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted flex items-center justify-center backdrop-blur-sm">
                              <Lock className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="h-6 w-32 bg-muted rounded" />
                                <Badge variant="secondary">#{place.index}</Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="h-4 w-full bg-muted rounded" />
                                <div className="h-4 w-3/4 bg-muted rounded" />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                <Lock className="h-4 w-4" />
                                <span>Por descubrir</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
