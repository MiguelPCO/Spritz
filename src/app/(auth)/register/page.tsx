"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return
    }
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      toast.error("Error al registrarse", { description: error.message })
      setLoading(false)
      return
    }

    toast.success("¡Cuenta creada! Revisa tu email para confirmar.")
    router.push("/today")
    router.refresh()
  }

  return (
    <div>
      <h2
        className="mb-1 text-2xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
      >
        Crea tu cuenta
      </h2>
      <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
        Tu armario de fragancias inteligente
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
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
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
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
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium"
          style={{ color: "var(--scent-accent)" }}
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
