"use client"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProtectedError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <h2
        className="mb-2 text-xl font-semibold"
        style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
      >
        Algo salió mal
      </h2>
      <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
        {error.message || "Error inesperado. Por favor, inténtalo de nuevo."}
      </p>
      <button
        onClick={reset}
        className="rounded-[12px] px-6 py-2.5 text-sm font-medium text-white"
        style={{ backgroundColor: "var(--scent-accent)" }}
      >
        Reintentar
      </button>
    </div>
  )
}
