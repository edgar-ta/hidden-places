import { UserGreeting } from "@/components/user-greeting"
import { AppFooter } from "@/components/app-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Gift, Search, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-6">
        <div className="container max-w-6xl mx-auto">
          <UserGreeting />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20">
            <Sparkles className="h-4 w-4" />
            Descubre lo oculto de tu ciudad
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">Hidden Places</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Encuentra códigos QR escondidos en lugares únicos de tu ciudad y gana premios exclusivos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/todos-los-lugares">
                <Search className="mr-2 h-5 w-5" />
                Explorar lugares
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
              <Link href="/premios">
                <Gift className="mr-2 h-5 w-5" />
                Mis premios
              </Link>
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Busca</h3>
                <p className="text-muted-foreground">
                  Explora tu ciudad y encuentra códigos QR escondidos en lugares insospechados
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Escanea</h3>
                <p className="text-muted-foreground">
                  Usa la cámara de tu teléfono para escanear el código QR y descubrir el lugar
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Gana</h3>
                <p className="text-muted-foreground">
                  Si eres el primero en encontrar un lugar, ganas un premio exclusivo
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold mb-6">Sobre el proyecto</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Hidden Places nace de la idea de redescubrir nuestra ciudad desde una perspectiva diferente. Cada
                  código QR está estratégicamente colocado en lugares que pasamos por alto día a día.
                </p>
                <p>
                  La iniciativa busca fomentar la exploración urbana, premiar la curiosidad y crear una comunidad de
                  exploradores que aprecian los detalles ocultos de nuestro entorno.
                </p>
                <p className="text-foreground font-medium">
                  Cada temporada presenta nuevos lugares, nuevos desafíos y nuevos premios para descubrir.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">¿Listo para explorar?</h2>
            <p className="text-muted-foreground mb-6">
              Comienza tu aventura y descubre los lugares ocultos de tu ciudad
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link href="/todos-los-lugares">Comenzar ahora</Link>
            </Button>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  )
}
