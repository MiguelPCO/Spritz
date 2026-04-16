import type { Metadata } from "next"
import Link from "next/link"
import { SprayParticles } from "@/components/layout/SprayParticles"

export const metadata: Metadata = {
  title: "Spritz — El armario inteligente para tus fragancias",
  description: "Descubre qué fragancia ponerte cada día con recomendaciones personalizadas basadas en el tiempo, la ocasión y tu estado de ánimo.",
}

const FEATURES = [
  {
    icon: "🌤️",
    title: "Recomendación diaria",
    desc: "La IA analiza el tiempo, tu colección y tu agenda para sugerirte la fragancia perfecta cada mañana.",
  },
  {
    icon: "🫙",
    title: "Tu armario completo",
    desc: "Organiza toda tu colección. Añade desde una base de datos o manualmente. Filtra por familia olfativa.",
  },
  {
    icon: "📅",
    title: "Registro de uso",
    desc: "Descubre qué llevas más, cuándo y por qué. Visualiza tus hábitos en un calendario con colores.",
  },
]

export default function HomePage() {
  return (
    <div
      className="relative min-h-dvh"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <SprayParticles intensity={0.5} />

      <div className="relative z-10 mx-auto max-w-[430px] px-6">
        {/* Hero */}
        <div className="flex flex-col items-center pt-20 text-center">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "var(--scent-accent)" }}
            />
            <span
              className="text-2xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-jakarta)",
                color: "var(--text-primary)",
              }}
            >
              spritz.
            </span>
          </div>

          <h1
            className="text-4xl font-semibold leading-tight tracking-tight"
            style={{
              fontFamily: "var(--font-jakarta)",
              color: "var(--text-primary)",
            }}
          >
            El armario inteligente
            <br />
            para tus fragancias.
          </h1>

          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Sabe qué ponerte hoy.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex w-full flex-col gap-3">
            <Link
              href="/register"
              className="flex h-12 w-full items-center justify-center rounded-[12px] text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--scent-accent)" }}
            >
              Empezar gratis
            </Link>
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-[12px] text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 space-y-4 pb-16">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-[20px] p-5"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <p className="mb-2 text-2xl">{f.icon}</p>
              <h3
                className="mb-1 text-base font-semibold"
                style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
