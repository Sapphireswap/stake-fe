import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAppKit } from '@reown/appkit/react';

declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

const SFT_TOKEN_ADDRESS = '0x196D3B04be42371a5E924C39A14ae0dB8882FD46';
const STAKING_CONTRACT_ADDRESS = '0x31ed4401530Cd2137A66fA19D8cB986eaB41b7Bf';

// Basic ERC20 ABI for approval
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function balanceOf(address account) public view returns (uint256)',
];

export function useTokenInteraction() {
  const { open } = useAppKit();
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');

  const getBalance = useCallback(async () => {
    if (!window.ethereum) {
      open();
      return '0';
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      const tokenContract = new ethers.Contract(SFT_TOKEN_ADDRESS, ERC20_ABI, signer);
      const decimals = await tokenContract.decimals();
      const balanceWei = await tokenContract.balanceOf(address);
      const balanceFormatted = ethers.utils.formatUnits(balanceWei, decimals);
      setBalance(balanceFormatted);
      return balanceFormatted;
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }, [open]);

  const checkAllowance = useCallback(async (amount: string) => {
    if (!window.ethereum) {
      open();
      return false;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      const tokenContract = new ethers.Contract(SFT_TOKEN_ADDRESS, ERC20_ABI, signer);
      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);
      const allowance = await tokenContract.allowance(address, STAKING_CONTRACT_ADDRESS);
      const isAllowed = allowance.gte(amountInWei);
      setIsApproved(isAllowed);
      return isAllowed;
    } catch (error) {
      console.error('Error checking allowance:', error);
      return false;
    }
  }, [open]);

  const approve = useCallback(async (amount: string) => {
    if (!window.ethereum) {
      open();
      return false;
    }
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      
      const tokenContract = new ethers.Contract(SFT_TOKEN_ADDRESS, ERC20_ABI, signer);
      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);
      const tx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, amountInWei);
      await tx.wait();
      setIsApproved(true);
      return true;
    } catch (error) {
      console.error('Error approving tokens:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [open]);

  const stake = useCallback(async (amount: string, poolId: number) => {
    if (!window.ethereum) {
      open();
      return false;
    }
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, [
        'function stake(uint256 _poolId, uint256 _amount) external',
      ], signer);
      const tokenContract = new ethers.Contract(SFT_TOKEN_ADDRESS, ERC20_ABI, signer);
      const decimals = await tokenContract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);
      const tx = await stakingContract.stake(poolId, amountInWei);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error staking tokens:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [open]);

  return {
    isApproved,
    isLoading,
    balance,
    checkAllowance,
    approve,
    stake,
    getBalance,
  };
} 