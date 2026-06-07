import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <div className="flex h-full min-h-0 flex-col">{children}</div>
      <Toaster />
    </ThemeProvider>
  )
}
