import { AppKitProvider } from '../context/AppKit'
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Sapphire Swap',
  description: 'ERC20 Token Staking Platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider>{children}</AppKitProvider>
        <Toaster />
      </body>
    </html>
  )
}
