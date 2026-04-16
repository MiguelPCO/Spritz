import type { ScentFamily } from "@/lib/constants/scentFamilies"
import { getScentFamily } from "@/lib/constants/scentFamilies"

/** Returns a validated scent family id safe to use as data-scent attr */
export function getScentDataAttr(family: string): ScentFamily {
  return getScentFamily(family).id
}
