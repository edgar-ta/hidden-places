"use client"

import { useState } from "react"
import type { Place } from "@/lib/types"
import { UserGreeting } from "@/components/user-greeting"
import { AppFooter } from "@/components/app-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, CheckCircle, Clock, Copy, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface PrizesClientProps {
  prizes: Place[]
}

type FilterType = "all" | "claimed" | "unclaimed"

export function PrizesClient({ prizes }: PrizesClientProps) {
  const [filter, setFilter] = useState<FilterType>("all")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const filteredPrizes = prizes.filter((prize) => {
    if (filter === "claimed") return prize.is_redeemed
    if (filter === "unclaimed") return !prize.is_redeemed
    return true
  })

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success("Código copiado")
    setTimeout(() => setCopiedCode(null), 2000)
  }

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
            <h1 className="text-4xl font-bold">Mis Premios</h1>
            <p className="text-muted-foreground">
              Aquí puedes ver todos los premios que has ganado al ser el primero en descubrir lugares
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
              Todos ({prizes.length})
            </Button>
            <Button
              variant={filter === "claimed" ? "default" : "outline"}
              onClick={() => setFilter("claimed")}
              size="sm"
            >
              Reclamados ({prizes.filter((p) => p.is_redeemed).length})
            </Button>
            <Button
              variant={filter === "unclaimed" ? "default" : "outline"}
              onClick={() => setFilter("unclaimed")}
              size="sm"
            >
              Sin reclamar ({prizes.filter((p) => !p.is_redeemed).length})
            </Button>
          </div>

          {/* Prizes List */}
          {filteredPrizes.length === 0 ? (
            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {filter === "all"
                      ? "Aún no tienes premios"
                      : filter === "claimed"
                        ? "No tienes premios reclamados"
                        : "No tienes premios sin reclamar"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === "all" ? "Sé el primero en descubrir lugares ocultos para ganar premios exclusivos" : ""}
                  </p>
                  {filter === "all" && (
                    <Button asChild>
                      <Link href="/todos-los-lugares">Explorar lugares</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPrizes.map((prize) => (
                <Card key={prize.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{prize.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Lugar #{prize.index}</Badge>
                          {prize.is_redeemed ? (
                            <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reclamado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-accent text-accent">
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Trophy className="h-6 w-6 text-accent flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Premio:</p>
                      <p className="font-semibold text-lg">{prize.prize}</p>
                    </div>
                    {!prize.is_redeemed && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Código para reclamar (contacta al organizador):
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-4 py-2 bg-muted rounded font-mono text-sm">
                              {prize.special_code}
                            </code>
                            <Button size="icon" variant="outline" onClick={() => copyCode(prize.special_code)}>
                              {copiedCode === prize.special_code ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
