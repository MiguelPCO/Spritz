import { Skeleton } from "@/components/ui/skeleton"

export default function TodayLoading() {
  return (
    <div className="space-y-5 pt-14">
      <div className="px-5">
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
      <div className="px-5">
        <Skeleton className="h-[180px] w-full rounded-[20px]" />
      </div>
      <div className="px-5 space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
