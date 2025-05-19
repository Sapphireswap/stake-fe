import Header from "@/components/header"
import UnstakeTable from "@/components/unstake-table"
import Footer from "@/components/footer"

export default function UnstakePage() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <Header />
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-12 z-10">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Your Active Stakes</h1>
          <UnstakeTable />
        </div>
      </main>
    </div>
  )
}
