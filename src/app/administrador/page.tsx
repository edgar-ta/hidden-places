import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { AdminLoginForm } from "@/components/admin-login-form"

export default async function AdminPage() {
  const isAdminUser = await isAdmin()

  if (isAdminUser) {
    redirect("/administrador/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <AdminLoginForm />
    </div>
  )
}
