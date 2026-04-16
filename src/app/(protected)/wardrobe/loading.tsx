import { Skeleton } from "@/components/ui/skeleton"

export default function WardrobeLoading() {
  return (
    <div className="pt-14 space-y-4">
      <div className="px-5">
        <Skeleton className="h-11 w-full rounded-[12px]" />
      </div>
      <div className="grid grid-cols-2 gap-3 px-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] rounded-[16px]" />
        ))}
      </div>
    </div>
  )
}
