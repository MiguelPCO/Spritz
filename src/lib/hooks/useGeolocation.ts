"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  lat: number | null
  lon: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ lat: null, lon: null, error: "Geolocalización no disponible", loading: false })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (err) => {
        setState({
          lat: null,
          lon: null,
          error: err.message,
          loading: false,
        })
      },
      { timeout: 10000, maximumAge: 300000 } // 5 min cache
    )
  }, [])

  return state
}
