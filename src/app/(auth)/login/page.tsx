"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error("Error al iniciar sesión", { description: error.message })
      setLoading(false)
      return
    }

    router.push("/today")
    router.refresh()
  }

  return (
    <div>
      <h2
        className="mb-1 text-2xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
      >
        Bienvenido de vuelta
      </h2>
      <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
        Inicia sesión para ver tu armario
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-11 w-full rounded-[12px] border px-4 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 w-full rounded-[12px] border px-4 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full rounded-[12px] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "var(--scent-accent)" }}
        >
          {loading ? "Entrando…" : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        ¿Sin cuenta?{" "}
        <Link
          href="/register"
          className="font-medium"
          style={{ color: "var(--scent-accent)" }}
        >
          Regístrate gratis
        </Link>
      </p>
    </div>
  )
}
