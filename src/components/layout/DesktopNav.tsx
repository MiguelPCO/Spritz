"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FlaskConical, Plus, Compass, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/today",    label: "Hoy",       icon: Home },
  { href: "/wardrobe", label: "Colección", icon: FlaskConical },
  { href: "/discover", label: "Descubrir", icon: Compass },
  { href: "/profile",  label: "Perfil",    icon: User },
] as const

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <header
      className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-16 items-center border-b px-8 gap-8"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
    >
      {/* Logo */}
      <Link href="/today" className="flex items-center gap-1.5 shrink-0">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: "var(--scent-accent)" }}
        />
        <span
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 300,
            fontSize: "1.125rem",
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
          }}
        >
          spritz.
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              )}
              style={{
                backgroundColor: isActive ? "var(--scent-accent-light)" : "transparent",
                color: isActive ? "var(--scent-accent)" : "var(--text-secondary)",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Add button */}
      <Link
        href="/add"
        className="flex items-center gap-2 h-9 px-4 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
        style={{ backgroundColor: "var(--scent-accent)" }}
        aria-label="Añadir fragancia"
      >
        <Plus size={16} strokeWidth={2.5} />
        Añadir
      </Link>
    </header>
  )
}
