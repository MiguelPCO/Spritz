import { NextRequest, NextResponse } from "next/server"
import { searchFragrances } from "@/lib/api/parfumo"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? ""
  if (!q.trim()) return NextResponse.json([])
  const results = await searchFragrances(q)
  return NextResponse.json(results)
}
