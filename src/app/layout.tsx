import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono, Fraunces } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/providers/QueryProvider"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-fraunces",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FBF8F4",
}

export const metadata: Metadata = {
  title: {
    template: "%s | Spritz",
    default: "Spritz — El armario inteligente para tus fragancias",
  },
  description:
    "Descubre qué fragancia ponerte cada día con recomendaciones personalizadas basadas en el tiempo, la ocasión y tu estado de ánimo.",
  keywords: ["fragrances", "perfume", "wardrobe", "recommendation", "spritz"],
  openGraph: {
    title: "Spritz — El armario inteligente para tus fragancias",
    description: "Sabe qué ponerte hoy.",
    type: "website",
    locale: "es_ES",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Spritz",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
    >
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
