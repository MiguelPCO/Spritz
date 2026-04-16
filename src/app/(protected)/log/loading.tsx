import { Skeleton } from "@/components/ui/skeleton"

export default function LogLoading() {
  return (
    <div className="pt-14 px-5 space-y-4">
      <Skeleton className="h-8 w-40 mx-auto" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded" />
        ))}
      </div>
    </div>
  )
}
