import { SprayParticles } from "@/components/layout/SprayParticles"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="relative flex min-h-dvh items-center justify-center px-6 py-12"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <SprayParticles intensity={0.7} />

      {/* Auth card */}
      <div
        className="relative z-10 w-full max-w-sm rounded-[20px] p-8 shadow-md"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--scent-accent)" }}
          />
          <span
            className="text-xl font-semibold tracking-tight"
            style={{
              fontFamily: "var(--font-jakarta)",
              color: "var(--text-primary)",
            }}
          >
            spritz.
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}
