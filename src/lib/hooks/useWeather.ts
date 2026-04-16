"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { WeatherData } from "@/types/weather"

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? "Error al obtener el tiempo")
  }
  return res.json()
}

export function useWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: lat !== null && lon !== null
      ? queryKeys.weather.byLocation(lat, lon)
      : queryKeys.weather.all,
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}
