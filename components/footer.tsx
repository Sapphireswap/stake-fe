import Link from "next/link"
import { Twitter, Github, DiscIcon as Discord } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-indigo-900/30 bg-midnight-dark/50 py-8 z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 3L4 12V28L20 37L36 28V12L20 3Z" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M20 3L12 8L20 13L28 8L20 3Z" fill="white" />
                  <path d="M12 8V18L20 23V13L12 8Z" fill="white" fillOpacity="0.7" />
                  <path d="M28 8V18L20 23V13L28 8Z" fill="white" fillOpacity="0.5" />
                </svg>
              </div>
              <div className="font-bold text-lg">
                <span className="text-white">SAPPHIRE</span>
                <span className="text-sapphire-blue ml-1">SWAP</span>
              </div>
            </div>
            <p className="text-indigo-200/70 text-sm">
              The next generation DeFi platform for staking and swapping tokens with high APY rewards.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Stake
                </Link>
              </li>
              <li>
                <Link href="/unstake" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Unstake
                </Link>
              </li>
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  $SFT Token
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Audit Reports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-indigo-200/70 hover:text-sapphire-blue transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-indigo-900/30 text-center text-indigo-200/50 text-sm">
          <p>© {new Date().getFullYear()} SapphireSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
