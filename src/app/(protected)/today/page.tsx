"use client"

import { useState, useMemo } from "react"
import { isToday } from "date-fns"
import { toast } from "sonner"
import { Sparkles, ArrowLeft } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { RecommendationCard } from "@/components/features/today/RecommendationCard"
import { WeatherBadge } from "@/components/features/today/WeatherBadge"
import { OccasionSelector } from "@/components/features/today/OccasionSelector"
import { MoodSelector } from "@/components/features/today/MoodSelector"
import { ActionButtons } from "@/components/features/today/ActionButtons"
import { FrequentFragrances } from "@/components/features/today/FrequentFragrances"
import { useGeolocation } from "@/lib/hooks/useGeolocation"
import { useWeather } from "@/lib/hooks/useWeather"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useRecentWears } from "@/lib/hooks/useWearLog"
import { useRecommendation } from "@/lib/hooks/useRecommendation"
import { useRecommendationStore } from "@/lib/stores/recommendationStore"
import { logWear } from "@/lib/actions/wear.actions"
import { getTimeOfDay } from "@/types/weather"
import { getFragranceName, getFragranceFamily, getFragranceFamilies } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import type { UserFragrance } from "@/types/fragrance"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function TodayPage() {
  const [wearing, setWearing] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)
  const { occasions, moods, freeText, toggleOccasion, toggleMood, setFreeText, reset } = useRecommendationStore()

  const { lat, lon, error: geoError, loading: geoLoading } = useGeolocation()
  const { data: weather } = useWeather(lat, lon)
  const { data: wardrobe = [], isLoading: wardrobeLoading } = useWardrobe()
  const { data: recentWearLogs = [] } = useRecentWears()

  // Derive top fragrances with wear count
  const topFragrancesWithCount = useMemo<Array<{ uf: UserFragrance; count: number }>>(() => {
    const freq = new Map<string, { uf: UserFragrance; count: number }>()
    for (const log of recentWearLogs) {
      if (!log.user_fragrance) continue
      const prev = freq.get(log.user_fragrance_id) ?? {
        uf: log.user_fragrance as unknown as UserFragrance,
        count: 0,
      }
      freq.set(log.user_fragrance_id, { ...prev, count: prev.count + 1 })
    }
    return [...freq.values()].sort((a, b) => b.count - a.count).slice(0, 4)
  }, [recentWearLogs])

  // Detect if already worn today
  const wornTodayFragrance = useMemo(() => {
    const todayLog = recentWearLogs.find((log) => isToday(new Date(log.worn_at)))
    if (!todayLog) return null
    return wardrobe.find((uf) => uf.id === todayLog.user_fragrance_id) ?? null
  }, [recentWearLogs, wardrobe])

  const aiContext = useMemo(() => {
    if (wardrobe.length === 0) return null
    return {
      weather,
      timeOfDay: getTimeOfDay(),
      occasions,
      moods,
      freeText: freeText.trim() || undefined,
      recentWears: recentWearLogs.map((log) => ({
        fragranceName: log.user_fragrance?.custom_name ?? log.user_fragrance?.fragrance?.name ?? "",
        brand: log.user_fragrance?.custom_brand ?? log.user_fragrance?.fragrance?.brand ?? "",
        wornAt: log.worn_at,
      })),
      wardrobe: wardrobe
        .filter((uf) => uf.status === "active")
        .map((uf) => ({
          id: uf.id,
          name: uf.fragrance?.name ?? uf.custom_name ?? "",
          brand: uf.fragrance?.brand ?? uf.custom_brand ?? "",
          family: getFragranceFamily(uf),
          families: getFragranceFamilies(uf),
          occasionTags: uf.occasion_tags,
          moodTags: uf.mood_tags,
          topNotes: uf.fragrance?.top_notes ?? [],
        })),
    }
  }, [wardrobe, recentWearLogs, weather, occasions, moods, freeText])

  const { data: recommendation, isLoading: recLoading, refresh } = useRecommendation(
    aiContext,
    hasRequested
  )

  const recommendedFragrance = recommendation
    ? wardrobe.find((uf) => uf.id === recommendation.fragranceId)
    : null

  async function handleWear() {
    if (!recommendedFragrance) return
    setWearing(true)
    try {
      await logWear({
        userFragranceId: recommendedFragrance.id,
        occasion: occasions[0] ?? null,
        mood: moods.length > 0 ? moods[0] : null,
        weather: weather ?? null,
        aiRecommended: true,
      })
      toast.success(`¡${getFragranceName(recommendedFragrance)} registrado!`, {
        description: "Añadido a tu registro de uso",
      })
    } catch (err) {
      toast.error("Error al registrar", {
        description: err instanceof Error ? err.message : undefined,
      })
      setWearing(false)
    }
  }

  function handleDiscover() {
    setHasRequested(true)
  }

  function handleChangeContext() {
    reset()
    setHasRequested(false)
    setWearing(false)
  }

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="md:hidden">
        <TopBar showLogo />
      </div>

      {weather && (
        <div className="px-5 pb-4">
          <WeatherBadge weather={weather} />
        </div>
      )}

      <div className="space-y-5 pb-8">

        {/* Empty wardrobe */}
        {!wardrobeLoading && wardrobe.length === 0 && (
          <div
            className="mx-5 rounded-[20px] p-6 text-center"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <p className="text-3xl mb-2">🫙</p>
            <p
              className="font-semibold mb-1"
              style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
            >
              Tu colección está vacía
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Añade tus primeras fragancias para recibir recomendaciones personalizadas.
            </p>
            <Link
              href="/add"
              className="inline-flex h-10 items-center rounded-[12px] px-5 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--scent-accent)" }}
            >
              Añadir fragancia
            </Link>
          </div>
        )}

        {/* Frequent fragrances */}
        {wardrobe.length > 0 && topFragrancesWithCount.length > 0 && (
          <FrequentFragrances fragrances={topFragrancesWithCount} />
        )}

        {/* — PHASE 1: Context selection — */}
        {wardrobe.length > 0 && !hasRequested && (
          <>
            {/* Already worn today banner */}
            {wornTodayFragrance && (
              <div
                className="mx-5 rounded-[16px] p-4 flex items-center gap-3"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <span className="text-2xl select-none">
                  {getScentFamily(getFragranceFamily(wornTodayFragrance)).emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {getFragranceName(wornTodayFragrance)}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ya registrada hoy</p>
                </div>
                <button
                  onClick={handleDiscover}
                  className="text-xs font-medium px-3 py-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--scent-accent-light)", color: "var(--scent-accent)" }}
                >
                  ¿Otra?
                </button>
              </div>
            )}

            {/* Context card */}
            <div
              className="mx-5 rounded-[20px] p-5 space-y-5"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <div>
                <h2
                  className="text-lg font-light"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                >
                  ¿Cómo es tu día hoy?
                </h2>
                <p className="mt-0.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Cuéntame y elegiré la fragancia perfecta para ti
                </p>
              </div>

              <div className="space-y-1">
                <p
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Ocasión <span className="normal-case font-normal" style={{ color: "var(--text-muted)" }}>(elige varias)</span>
                </p>
                <OccasionSelector value={occasions} onToggle={toggleOccasion} />
              </div>

              <div className="space-y-1">
                <p
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Estado de ánimo <span className="normal-case font-normal" style={{ color: "var(--text-muted)" }}>(elige varios)</span>
                </p>
                <MoodSelector value={moods} onChange={(newMoods) => {
                  const toAdd = newMoods.filter((m) => !moods.includes(m))
                  const toRemove = moods.filter((m) => !newMoods.includes(m))
                  toAdd.forEach(toggleMood)
                  toRemove.forEach(toggleMood)
                }} />
              </div>

              <div className="space-y-1">
                <p
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Algo más que quieras contarme
                </p>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Ej: tengo una reunión importante, voy a salir por la noche…"
                  rows={2}
                  className="w-full rounded-[12px] border px-4 py-3 text-sm outline-none resize-none"
                  style={{
                    backgroundColor: "var(--bg-page)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Discover CTA */}
            <div className="px-5">
              <button
                onClick={handleDiscover}
                disabled={wardrobeLoading || geoLoading}
                className="flex w-full h-[52px] items-center justify-center gap-2 rounded-[16px] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--scent-accent)" }}
              >
                <Sparkles size={16} />
                Descubrir mi fragancia del día
              </button>
              {geoLoading && (
                <p
                  className="mt-2 text-center text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Obteniendo tu ubicación…
                </p>
              )}
              {geoError && !weather && (
                <p
                  className="mt-2 text-center text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Sin datos de tiempo — la IA usará otros factores
                </p>
              )}
            </div>
          </>
        )}

        {/* — PHASE 2: Recommendation — */}
        {hasRequested && (
          <>
            {recLoading && !recommendation && (
              <div className="space-y-3 mx-5">
                <Skeleton className="h-[200px] w-full rounded-[20px]" />
                <Skeleton className="h-12 w-full rounded-[12px]" />
              </div>
            )}

            {recommendedFragrance && recommendation && (
              <RecommendationCard
                userFragrance={recommendedFragrance}
                reason={recommendation.reason}
                weatherLabel={weather ? `${weather.temp}°C` : undefined}
              />
            )}

            {recommendedFragrance && (
              <ActionButtons
                onWear={handleWear}
                onSkip={() => { setWearing(false); refresh() }}
                wearing={wearing}
                loading={recLoading}
              />
            )}

            {!recLoading && (
              <div className="flex justify-center">
                <button
                  onClick={handleChangeContext}
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  <ArrowLeft size={13} />
                  Cambiar plan del día
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
