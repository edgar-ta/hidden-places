"use client"

import { useState } from "react"
import type { Place } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PlacesManagerProps {
  places: Place[]
}

export function PlacesManager({ places }: PlacesManagerProps) {
  const router = useRouter()
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prize: "",
    valid: true,
  })

  const openEditDialog = (place: Place) => {
    setSelectedPlace(place)
    setFormData({
      name: place.name,
      description: place.description,
      prize: place.prize,
      valid: place.valid,
    })
  }

  const handleUpdate = async () => {
    if (!selectedPlace) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/place/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: selectedPlace.id,
          ...formData,
        }),
      })

      if (response.ok) {
        toast.success("Lugar actualizado")
        setSelectedPlace(null)
        router.refresh()
      } else {
        toast.error("Error al actualizar lugar")
      }
    } catch (error) {
      toast.error("Error al actualizar lugar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Lugares</CardTitle>
        <CardDescription>Edita la información de los lugares</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {places.map((place) => (
            <div key={place.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{place.name}</span>
                  <Badge variant="secondary">#{place.index}</Badge>
                  {!place.valid && <Badge variant="outline">Inactivo</Badge>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{place.description}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(place)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Lugar</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={isLoading}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prize">Premio</Label>
                      <Input
                        id="prize"
                        value={formData.prize}
                        onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="valid">Activo</Label>
                      <Switch
                        id="valid"
                        checked={formData.valid}
                        onCheckedChange={(checked) => setFormData({ ...formData, valid: checked })}
                        disabled={isLoading}
                      />
                    </div>
                    <Button onClick={handleUpdate} disabled={isLoading} className="w-full">
                      Guardar Cambios
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
