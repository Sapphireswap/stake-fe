"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useTokenInteraction } from "@/hooks/useTokenInteraction"
import { toast } from "@/components/ui/use-toast"

type StakingPeriod = "15" | "30" | "90"

const POOL_IDS: Record<StakingPeriod, number> = {
  "15": 0,
  "30": 1,
  "90": 2,
}

const APY_RATES: Record<StakingPeriod, string> = {
  "15": "50%",
  "30": "150%",
  "90": "500%",
}

export default function StakingForm() {
  const [amount, setAmount] = useState("")
  const [period, setPeriod] = useState<StakingPeriod>("15")
  const [estimatedRewards, setEstimatedRewards] = useState("0.00")
  const { isApproved, isLoading, balance, checkAllowance, approve, stake, getBalance } = useTokenInteraction()

  useEffect(() => {
    getBalance()
  }, [getBalance])

  // Calculate estimated rewards when amount or period changes
  useEffect(() => {
    if (amount && period) {
      const principal = Number.parseFloat(amount) || 0
      const apy = Number.parseFloat(APY_RATES[period].replace("%", "")) / 100
      const days = Number.parseInt(period)
      
      // Calculate rewards based on the staking period and APY
      // (Principal * APY * (days / 365))
      const rewards = principal * apy * (days / 365)
      setEstimatedRewards(rewards.toFixed(2))
    } else {
      setEstimatedRewards("0.00")
    }
  }, [amount, period])

  // Check allowance when amount changes
  useEffect(() => {
    if (amount) {
      checkAllowance(amount)
    }
  }, [amount, checkAllowance])

  const handleStake = async () => {
    try {
      if (!isApproved) {
        const approved = await approve(amount)
        if (!approved) {
          toast({
            title: "Error",
            description: "Failed to approve tokens",
            variant: "destructive",
          })
          return
        }
      }

      const poolId = POOL_IDS[period]
      const success = await stake(amount, poolId)
      
      if (success) {
        toast({
          title: "Success",
          description: "Successfully staked tokens",
        })
        setAmount("")
        getBalance()
      } else {
        toast({
          title: "Error",
          description: "Failed to stake tokens",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error staking:", error)
      toast({
        title: "Error",
        description: "An error occurred while staking",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md border-indigo-900/30 bg-midnight-light/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Stake $SFT</CardTitle>
        <CardDescription className="text-indigo-200/70">
          Lock your tokens to earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-midnight-dark border-indigo-900/50 text-white focus:ring-sapphire-blue focus:border-sapphire-blue pr-24"
            />
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-sapphire-blue hover:text-sapphire-blue/90"
              onClick={() => setAmount(balance)}
            >
              MAX
            </Button>
          </div>
        </div>

        <Select value={period} onValueChange={(value: StakingPeriod) => setPeriod(value)}>
          <SelectTrigger className="bg-midnight-dark border-indigo-900/50 text-white">
            <SelectValue placeholder="Select lock-in period" />
          </SelectTrigger>
          <SelectContent className="bg-midnight-dark border-indigo-900/50 text-white">
            <SelectItem value="15">15 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-indigo-200">
            <span>APY</span>
            <span className="text-sapphire-blue font-semibold">{APY_RATES[period]}</span>
          </div>
          <div className="flex justify-between items-center text-indigo-200">
            <span>Est. Rewards</span>
            <span className="text-white font-semibold">{estimatedRewards} $SFT</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-sapphire-blue hover:bg-sapphire-blue/90 text-white font-medium py-6"
          disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
          onClick={handleStake}
        >
          {isLoading ? (
            "Processing..."
          ) : isApproved ? (
            <>
              Stake Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Approve"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
