"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUnstakeInteraction, UserStake } from "@/hooks/useUnstakeInteraction"
import { toast } from "@/components/ui/use-toast"
import { Lock, Unlock } from "lucide-react"

const POOL_PERIODS: Record<number, string> = {
  0: "15 days",
  1: "30 days",
  2: "90 days",
}

const POOL_DAYS: Record<number, number> = {
  0: 15,
  1: 30,
  2: 90,
}

interface StakeCardProps {
  stake: UserStake
  onUnstake: (stake: UserStake) => void
  isLoading: boolean
  isLocked: boolean
}

function StakeCard({ stake, onUnstake, isLoading, isLocked }: StakeCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getUnlockDate = (startTime: number, lockDays: number) => {
    const unlockDate = new Date((startTime + (lockDays * 24 * 60 * 60)) * 1000)
    return formatDate(unlockDate.getTime() / 1000)
  }

  return (
    <Card className="p-6 bg-midnight-light/50 backdrop-blur-sm border-indigo-900/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-indigo-200/70 text-sm">Amount</div>
          <div className="text-white font-semibold">{parseFloat(stake.amount).toFixed(2)} $SFT</div>
        </div>
        <div>
          <div className="text-indigo-200/70 text-sm">Lock Period</div>
          <div className="text-white">{POOL_PERIODS[stake.poolId]}</div>
        </div>
        <div>
          <div className="text-indigo-200/70 text-sm">APY</div>
          <div className="text-sapphire-blue font-semibold">{stake.apy}%</div>
        </div>
        <div>
          <div className="text-indigo-200/70 text-sm">Start Date</div>
          <div className="text-white">{formatDate(stake.startTime)}</div>
        </div>
        <div className="col-span-2 md:col-span-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-indigo-200/70">Current Rewards: </span>
                <span className="text-sapphire-blue font-semibold">{parseFloat(stake.rewards).toFixed(2)} $SFT</span>
              </div>
              {isLocked && (
                <div className="text-amber-400">
                  <span className="text-indigo-200/70">Unlocks: </span>
                  <span>{getUnlockDate(stake.startTime, POOL_DAYS[stake.poolId])}</span>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => onUnstake(stake)}
                disabled={isLoading || isLocked}
                className={isLocked ? "bg-gray-600 cursor-not-allowed" : "bg-sapphire-blue hover:bg-sapphire-blue/90 text-white"}
              >
                {isLoading ? "Processing..." : isLocked ? "Locked" : "Unstake"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function UnstakeTable() {
  const { stakes, isLoading, getUserStakes, withdraw } = useUnstakeInteraction()

  useEffect(() => {
    getUserStakes()
  }, [getUserStakes])

  const handleUnstake = async (stake: UserStake) => {
    try {
      const success = await withdraw(stake.poolId, stake.stakeIndex)
      if (success) {
        toast({
          title: "Success",
          description: "Successfully unstaked tokens",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to unstake tokens",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error unstaking:", error)
      toast({
        title: "Error",
        description: "An error occurred while unstaking",
        variant: "destructive",
      })
    }
  }

  const isStakeLocked = (stake: UserStake) => {
    const now = Math.floor(Date.now() / 1000)
    const unlockTime = stake.startTime + (POOL_DAYS[stake.poolId] * 24 * 60 * 60)
    return now < unlockTime
  }

  const lockedStakes = stakes.filter(isStakeLocked)
  const unlockedStakes = stakes.filter(stake => !isStakeLocked(stake))

  if (stakes.length === 0) {
    return (
      <Card className="p-6 text-center text-indigo-200/70 bg-midnight-light/50 backdrop-blur-sm border-indigo-900/30">
        No active stakes found
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {lockedStakes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-white">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2>Locked Stakes</h2>
          </div>
          {lockedStakes.map((stake) => (
            <StakeCard
              key={`${stake.poolId}-${stake.stakeIndex}`}
              stake={stake}
              onUnstake={handleUnstake}
              isLoading={isLoading}
              isLocked={true}
            />
          ))}
        </div>
      )}

      {unlockedStakes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-white">
            <Unlock className="w-5 h-5 text-green-400" />
            <h2>Unlocked Stakes</h2>
          </div>
          {unlockedStakes.map((stake) => (
            <StakeCard
              key={`${stake.poolId}-${stake.stakeIndex}`}
              stake={stake}
              onUnstake={handleUnstake}
              isLoading={isLoading}
              isLocked={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
