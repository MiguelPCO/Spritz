"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FlaskConical, Plus, Compass, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/today",    label: "Hoy",       icon: Home  },
  { href: "/wardrobe", label: "Colección", icon: FlaskConical },
  { href: "/add",      label: "",          icon: Plus  }, // FAB center
  { href: "/discover", label: "Descubrir",  icon: Compass },
  { href: "/profile",  label: "Perfil",    icon: User  },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="safe-bottom fixed bottom-0 left-1/2 flex w-full max-w-[430px] -translate-x-1/2 items-end justify-around border-t px-2"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon

        // Center FAB button
        if (item.href === "/add") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-4 flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--scent-accent)",
                color: "#ffffff",
              }}
              aria-label="Añadir fragancia"
            >
              <Plus size={24} strokeWidth={2.5} />
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 pt-3 text-center transition-colors"
            )}
            style={{
              color: isActive ? "var(--scent-accent)" : "var(--text-muted)",
            }}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[11px] font-medium leading-none">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
