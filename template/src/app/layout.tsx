import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Ask Temp",
  description: "Next.js app with collapsible sidebar",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  )
}