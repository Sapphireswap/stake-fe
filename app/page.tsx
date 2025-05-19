import Header from "@/components/header"
import StakingForm from "@/components/staking-form"
import Footer from "@/components/footer"

export default function Home() {
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
      <main className="flex-grow flex items-center justify-center px-4 py-12 z-10">
        <StakingForm />
      </main>
    </div>
  )
}
