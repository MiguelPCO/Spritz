import Link from "next/link"

export default function NotFound() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <p className="text-6xl mb-4">🔍</p>
      <h1
        className="mb-2 text-2xl font-semibold"
        style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
      >
        Página no encontrada
      </h1>
      <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>
        La página que buscas no existe.
      </p>
      <Link
        href="/"
        className="rounded-[12px] px-6 py-2.5 text-sm font-medium text-white"
        style={{ backgroundColor: "var(--scent-accent)" }}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
