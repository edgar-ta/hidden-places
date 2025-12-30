"use client"

import { useState } from "react"
import type { Place } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Trophy } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PrizeVerificationProps {
  places: Place[]
}

export function PrizeVerification({ places }: PrizeVerificationProps) {
  const router = useRouter()
  const [codeInput, setCodeInput] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})

  const verifyAndClaim = async (place: Place) => {
    const code = codeInput[place.id]

    if (!code) {
      toast.error("Ingresa el código")
      return
    }

    if (code !== place.special_code) {
      toast.error("Código incorrecto")
      return
    }

    setIsLoading({ ...isLoading, [place.id]: true })

    try {
      const response = await fetch("/api/admin/prize/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: place.id }),
      })

      if (response.ok) {
        toast.success("Premio marcado como reclamado")
        router.refresh()
      } else {
        toast.error("Error al marcar premio")
      }
    } catch (error) {
      toast.error("Error al marcar premio")
    } finally {
      setIsLoading({ ...isLoading, [place.id]: false })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificación de Premios</CardTitle>
        <CardDescription>Verifica códigos y marca premios como reclamados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {places.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aún no hay premios ganados</p>
          ) : (
            places.map((place) => (
              <div key={place.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span className="font-semibold">{place.name}</span>
                      <Badge variant="secondary">#{place.index}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{place.prize}</p>
                  </div>
                  {place.is_redeemed && (
                    <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Reclamado
                    </Badge>
                  )}
                </div>

                {!place.is_redeemed && (
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`code-${place.id}`} className="text-xs">
                        Código del usuario
                      </Label>
                      <Input
                        id={`code-${place.id}`}
                        placeholder="Ingresa el código"
                        value={codeInput[place.id] || ""}
                        onChange={(e) => setCodeInput({ ...codeInput, [place.id]: e.target.value })}
                        disabled={isLoading[place.id]}
                      />
                    </div>
                    <Button
                      onClick={() => verifyAndClaim(place)}
                      disabled={isLoading[place.id]}
                      className="mt-auto"
                      size="sm"
                    >
                      Verificar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
