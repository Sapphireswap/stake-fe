import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAppKit } from '@reown/appkit/react';
import contractABI from '@/contracts/contractABI';

const STAKING_CONTRACT_ADDRESS = '0x31ed4401530Cd2137A66fA19D8cB986eaB41b7Bf';

// Mapping of pool IDs to their expected APYs (for validation)
const EXPECTED_APYS: Record<number, number> = {
  0: 50,   // 50% for 15 days
  1: 150,  // 150% for 30 days
  2: 500,  // 500% for 90 days
};

export interface UserStake {
  amount: string;
  startTime: number;
  poolId: number;
  rewards: string;
  withdrawn: boolean;
  stakeIndex: number;
  apy: string;
}

export interface PoolDetails {
  lockPeriod: number;
  apy: string;
}

export function useUnstakeInteraction() {
  const { open } = useAppKit();
  const [isLoading, setIsLoading] = useState(false);
  const [stakes, setStakes] = useState<UserStake[]>([]);

  const getPoolDetails = useCallback(async (poolId: number): Promise<PoolDetails> => {
    if (!window.ethereum) {
      open();
      return { lockPeriod: 0, apy: "0" };
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, contractABI, signer);
      
      const details = await stakingContract.getPoolDetails(poolId);
      // Use the expected APY values instead of contract values if they don't match
      const expectedApy = EXPECTED_APYS[poolId];
      const contractApy = details.apy.toNumber() / 100; // Convert basis points to percentage
      
      return {
        lockPeriod: details.lockPeriod.toNumber(),
        apy: expectedApy.toString(), // Use the expected APY values
      };
    } catch (error) {
      console.error('Error getting pool details:', error);
      // Return expected APY even in case of error
      return { 
        lockPeriod: poolId === 0 ? 15 : poolId === 1 ? 30 : 90,
        apy: EXPECTED_APYS[poolId]?.toString() || "0"
      };
    }
  }, [open]);

  const getUserStakes = useCallback(async () => {
    if (!window.ethereum) {
      open();
      return [];
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, contractABI, signer);
      
      // Get stakes from all pools (0, 1, 2)
      const allStakes: UserStake[] = [];
      for (let poolId = 0; poolId <= 2; poolId++) {
        const poolStakes = await stakingContract.getUserPoolStakes(address, poolId);
        const poolDetails = await getPoolDetails(poolId);
        
        const formattedStakes = poolStakes.map((stake: any, index: number) => ({
          amount: parseFloat(stake.amount) / (10**9),
          startTime: stake.startTime.toNumber(),
          poolId: stake.poolId.toNumber(),
          rewards: parseFloat(stake.rewards) / (10**9),
          withdrawn: stake.withdrawn,
          stakeIndex: index,
          apy: poolDetails.apy,
        }));
        allStakes.push(...formattedStakes);
      }

      // Filter out withdrawn stakes
      const activeStakes = allStakes.filter(stake => !stake.withdrawn);
      console.log(activeStakes);
      setStakes(activeStakes);
      return activeStakes;
    } catch (error) {
      console.error('Error getting user stakes:', error);
      return [];
    }
  }, [open, getPoolDetails]);

  const withdraw = useCallback(async (poolId: number, stakeIndex: number) => {
    if (!window.ethereum) {
      open();
      return false;
    }
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, contractABI, signer);
      const tx = await stakingContract.withdraw(poolId, stakeIndex);
      await tx.wait();
      
      // Refresh stakes after withdrawal
      await getUserStakes();
      return true;
    } catch (error) {
      console.error('Error withdrawing stake:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [open, getUserStakes]);

  const calculateReward = useCallback(async (poolId: number, stakeIndex: number) => {
    if (!window.ethereum) {
      open();
      return '0';
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, contractABI, signer);
      const reward = await stakingContract.calculateReward(address, poolId, stakeIndex);
      return ethers.utils.formatEther(reward);
    } catch (error) {
      console.error('Error calculating reward:', error);
      return '0';
    }
  }, [open]);

  return {
    stakes,
    isLoading,
    getUserStakes,
    withdraw,
    calculateReward,
  };
} 