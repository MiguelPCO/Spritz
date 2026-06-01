import type { Metadata } from "next"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { FragranceDetailPage } from "@/components/features/detail/FragranceDetailPage"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from("user_fragrances")
    .select("custom_name, fragrance:fragrances(name, brand)")
    .eq("id", id)
    .maybeSingle()

  const name = (data?.fragrance as { name?: string } | null)?.name ?? data?.custom_name ?? "Fragancia"
  const brand = (data?.fragrance as { brand?: string } | null)?.brand ?? ""

  return {
    title: brand ? `${name} · ${brand}` : name,
  }
}

export default function Page({ params }: Props) {
  return <FragranceDetailPage params={params} />
}
