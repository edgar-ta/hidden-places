import { FooterUsernameForm } from "@/components/footer-username-form"

export function AppFooter() {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <FooterUsernameForm />
          <div className="text-center text-xs text-muted-foreground">
            <p>Hidden Places © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
