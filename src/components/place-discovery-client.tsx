"use client"

import { useEffect, useState } from "react"
import type { Place, Season, SeasonStatus, User, Sightseeing } from "@/lib/types"
import { UserGreeting } from "@/components/user-greeting"
import { AppFooter } from "@/components/app-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Trophy, Calendar, Copy, Check, Home } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface PlaceDiscoveryClientProps {
  place: Place
  season: Season
  seasonStatus: SeasonStatus
  user: User
  existingSightseeing: Sightseeing | null
  sightseeingCount: number
  isFirstVisitor: boolean
  hasWonPrize: boolean
}

export function PlaceDiscoveryClient({
  place,
  season,
  seasonStatus,
  user,
  existingSightseeing,
  sightseeingCount,
  isFirstVisitor,
  hasWonPrize,
}: PlaceDiscoveryClientProps) {
  const [isFirstView, setIsFirstView] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentSightseeingCount, setCurrentSightseeingCount] = useState(sightseeingCount)

  useEffect(() => {
    const key = `place_${place.id}_visited`
    const hasVisited = localStorage.getItem(key)

    if (!hasVisited) {
      setIsFirstView(true)
      localStorage.setItem(key, "true")

      // Create sightseeing record
      if (!existingSightseeing) {
        createSightseeing()
      }
    }
  }, [place.id, existingSightseeing])

  const createSightseeing = async () => {
    try {
      const response = await fetch("/api/sightseeing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: place.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentSightseeingCount(data.position)
      }
    } catch (error) {
      console.error("Error creating sightseeing:", error)
    }
  }

  const copySpecialCode = () => {
    navigator.clipboard.writeText(place.special_code)
    setCopied(true)
    toast.success("Código copiado al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate()
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
  }

  // Season not active
  if (seasonStatus === "not-started") {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="w-full px-4 py-6">
          <div className="container max-w-6xl mx-auto">
            <UserGreeting />
          </div>
        </header>

        <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
          <Card className="border-2">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Temporada no iniciada</h2>
              <p className="text-muted-foreground">
                Esta temporada comenzará el {formatDate(season.start_date)}. ¡Vuelve pronto!
              </p>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>

        <AppFooter />
      </div>
    )
  }

  if (seasonStatus === "expired") {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="w-full px-4 py-6">
          <div className="container max-w-6xl mx-auto">
            <UserGreeting />
          </div>
        </header>

        <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
          <Card className="border-2">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Temporada finalizada</h2>
              <p className="text-muted-foreground">
                Esta temporada finalizó el {formatDate(season.end_date)}. ¡Mantente atento a la próxima temporada!
              </p>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>

        <AppFooter />
      </div>
    )
  }

  // Season is active
  const userPosition = currentSightseeingCount || sightseeingCount

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full px-4 py-6">
        <div className="container max-w-6xl mx-auto">
          <UserGreeting />
        </div>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Prize Status */}
        {hasWonPrize && (
          <motion.div
            initial={isFirstView ? { scale: 0.8, opacity: 0 } : false}
            animate={isFirstView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <Card className="border-2 border-accent bg-gradient-to-br from-accent/10 to-accent/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-accent" />
                  <CardTitle className="text-accent">¡Felicidades, ganaste!</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {place.is_redeemed ? (
                  <p className="text-muted-foreground">Tu premio ya ha sido reclamado. ¡Gracias por participar!</p>
                ) : (
                  <>
                    <p>Eres la primera persona en encontrar este lugar. Tu premio te espera:</p>
                    <div className="p-4 bg-background rounded-lg border-2 border-accent">
                      <p className="font-semibold text-lg mb-2">{place.prize}</p>
                      <Separator className="my-3" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Para reclamar tu premio, contacta al organizador y proporciona este código:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-muted rounded font-mono text-sm">
                            {place.special_code}
                          </code>
                          <Button size="icon" variant="outline" onClick={copySpecialCode}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!hasWonPrize && (
          <motion.div
            initial={isFirstView ? { y: 20, opacity: 0 } : false}
            animate={isFirstView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">¡Lugar descubierto!</h2>
                  <p className="text-muted-foreground">
                    Eres la persona <span className="font-bold text-primary">#{userPosition}</span> en encontrar este
                    lugar
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Place Information */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{place.name}</CardTitle>
              <Badge variant="secondary">Lugar #{place.index}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {place.pictures.length > 0 && (
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={place.pictures[0] || "/placeholder.svg"}
                  alt={place.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <p className="text-muted-foreground leading-relaxed">{place.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{currentSightseeingCount || sightseeingCount} personas han descubierto este lugar</span>
            </div>
          </CardContent>
        </Card>

        {/* Link to home */}
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Conoce más sobre el proyecto
            </Link>
          </Button>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
