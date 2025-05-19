'use client'

import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { ReactNode } from 'react'

const projectId = 'ede44b376fb0caa28f89eca27f9f1220'

const metadata = {
  name: 'Sapphire Swap',
  description: 'ERC20 Token Staking Platform',
  url: 'http://localhost:3000',
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata,
  networks: [mainnet, arbitrum],
  projectId,
  features: {
    analytics: true
  }
})

interface AppKitProviderProps {
  children: ReactNode
}

export function AppKitProvider({ children }: AppKitProviderProps) {
  return <>{children}</>
} 