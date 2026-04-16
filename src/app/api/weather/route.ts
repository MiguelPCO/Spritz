import { NextResponse } from "next/server"
import { fetchWeatherByCoords } from "@/lib/api/openweather"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get("lat") ?? "")
  const lon = parseFloat(searchParams.get("lon") ?? "")

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: "Missing or invalid lat/lon parameters" },
      { status: 400 }
    )
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: "Coordinates out of range" },
      { status: 400 }
    )
  }

  try {
    const weather = await fetchWeatherByCoords(lat, lon)
    return NextResponse.json(weather, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
