import { cn } from "@/lib/utils"

interface TopBarProps {
  title?: string
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  className?: string
  /** Show the Spritz wordmark instead of a title */
  showLogo?: boolean
}

export function TopBar({
  title,
  leftSlot,
  rightSlot,
  className,
  showLogo = false,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between px-5",
        className
      )}
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Left slot */}
      <div className="flex w-10 items-center">{leftSlot}</div>

      {/* Center: logo or title */}
      <div className="flex-1 text-center">
        {showLogo ? (
          <div className="flex items-center justify-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--scent-accent)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 300,
                fontSize: "1.25rem",
                letterSpacing: "-0.01em",
                color: "var(--text-primary)",
              }}
            >
              spritz.
            </span>
          </div>
        ) : (
          <h1
            className="text-base font-semibold"
            style={{
              fontFamily: "var(--font-jakarta)",
              color: "var(--text-primary)",
            }}
          >
            {title}
          </h1>
        )}
      </div>

      {/* Right slot */}
      <div className="flex w-10 items-center justify-end">{rightSlot}</div>
    </header>
  )
}
