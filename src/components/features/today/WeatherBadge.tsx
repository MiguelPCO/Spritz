import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, Wind, Droplets, CloudFog } from "lucide-react"
import type { WeatherData } from "@/types/weather"
import { cn } from "@/lib/utils"

const ICONS = {
  clear: Sun,
  "partly-cloudy": Cloud,
  cloudy: Cloud,
  rain: CloudRain,
  snow: Snowflake,
  thunder: CloudLightning,
  fog: CloudFog,
  windy: Wind,
  humid: Droplets,
} as const

interface WeatherBadgeProps {
  weather: WeatherData
  className?: string
}

export function WeatherBadge({ weather, className }: WeatherBadgeProps) {
  const Icon = ICONS[weather.condition] ?? Sun

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
        className
      )}
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      <Icon
        size={14}
        style={{ color: "var(--scent-accent)" }}
        strokeWidth={1.5}
      />
      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {weather.temp}°C · {weather.description}
      </span>
    </div>
  )
}
