"use client"

import { cn } from "@/lib/utils"

interface Particle {
  id: number
  size: number
  top: string
  left: string
  delay: string
  duration: string
  opacity: number
}

const PARTICLES: Particle[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 4 + (i % 4) * 3,
  top: `${(i * 17 + 5) % 90}%`,
  left: `${(i * 23 + 10) % 90}%`,
  delay: `${(i * 0.4).toFixed(1)}s`,
  duration: `${3 + (i % 3)}s`,
  opacity: 0.06 + (i % 5) * 0.02,
}))

interface SprayParticlesProps {
  className?: string
  /** Multiplier for opacity (default 1.0). Use < 1 for more subtle backgrounds. */
  intensity?: number
}

export function SprayParticles({
  className,
  intensity = 1,
}: SprayParticlesProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            opacity: p.opacity * intensity,
            backgroundColor: "var(--scent-accent)",
            animation: `spray-float ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
