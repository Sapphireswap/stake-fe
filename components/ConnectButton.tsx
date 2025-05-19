'use client'

import { Button } from "@/components/ui/button"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export default function ConnectButton() {
  return (
    <Button asChild className="bg-sapphire-blue hover:bg-sapphire-blue/90 text-white border-none">
      <appkit-button />
    </Button>
  )
} 