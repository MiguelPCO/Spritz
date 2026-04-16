export const queryKeys = {
  wardrobe: {
    all: ["wardrobe"] as const,
    list: () => [...queryKeys.wardrobe.all, "list"] as const,
    detail: (id: string) => [...queryKeys.wardrobe.all, "detail", id] as const,
  },
  wearLog: {
    all: ["wear-log"] as const,
    list: () => [...queryKeys.wearLog.all, "list"] as const,
    recent: () => [...queryKeys.wearLog.all, "recent"] as const,
    byMonth: (year: number, month: number) =>
      [...queryKeys.wearLog.all, "month", year, month] as const,
    byFragrance: (userFragranceId: string) =>
      [...queryKeys.wearLog.all, "fragrance", userFragranceId] as const,
  },
  weather: {
    all: ["weather"] as const,
    byLocation: (lat: number, lon: number) =>
      [...queryKeys.weather.all, lat, lon] as const,
  },
  recommendation: {
    all: ["recommendation"] as const,
    current: () => [...queryKeys.recommendation.all, "current"] as const,
  },
  profile: {
    all: ["profile"] as const,
    current: () => [...queryKeys.profile.all, "current"] as const,
  },
} as const
