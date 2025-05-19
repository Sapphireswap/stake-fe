import Link from "next/link"
import Image from "next/image"
import ConnectButton from "./ConnectButton"

export default function Header() {
  return (
    <header className="border-b border-indigo-900/30 backdrop-blur-sm bg-midnight/80 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative w-40 h-12">
            <Image
              src="/logo.png"
              alt="SapphireSwap Logo"
              width={160}
              height={48}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-white hover:text-sapphire-blue transition-colors">
            Stake
          </Link>
          <Link href="/unstake" className="text-white hover:text-sapphire-blue transition-colors">
            Positions
          </Link>
        </nav>
        <ConnectButton />
      </div>
    </header>
  )
}
