'use client'
import { useEffect, useState } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import BetCard from "./BetCard";
import BetButton from "./buttons/BetButton";
import { contractAbi, contractAddress } from '@/utils/contract';

interface Bet {
  creator: string;
  opponent: string;
  betAmount: bigint;
  distanceGoal: bigint;
  deadline: bigint;
  opponentDistance: bigint;
  betDescription: string;
  status: number;
}

export default function Dashboard() {
  const [bets, setBets] = useState<(Bet & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const fetchBets = async () => {
    if (!publicClient || !address) return;

    try {
      setLoading(true);
      const nextBetId = await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'bets',
        args: [0],
      }) as Bet;

      const betPromises = [];
      // Start from 1 since 0 is not a valid bet ID (we use it to get the next bet ID)
      for (let i = 1; i < 100; i++) {
        betPromises.push(
          publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'bets',
            args: [BigInt(i)],
          }).catch(() => null)
        );
      }

      const results = await Promise.all(betPromises);
      const validBets = results
        .map((bet, index) => bet ? { ...bet as Bet, id: index + 1 } : null)
        .filter((bet): bet is (Bet & { id: number }) => 
          bet !== null && 
          (bet.creator === address || bet.opponent === address) && 
          bet.status !== 2 // Filter out completed bets
        );

      setBets(validBets);
    } catch (error) {
      console.error('Error fetching bets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
    // Poll for new bets every 30 seconds
    const interval = setInterval(fetchBets, 30000);
    return () => clearInterval(interval);
  }, [publicClient, address]);

  return (
    <section id="dashboard" className="flex flex-col items-center justify-center gap-4 w-full min-h-screen bg-[#121212] text-white p-8 pt-28">
      <h1 className="text-4xl font-bold">Active Bets</h1>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {loading ? (
          <div className="text-center text-gray-400">Loading bets...</div>
        ) : bets.length === 0 ? (
          <div className="text-center text-gray-400">No active bets found</div>
        ) : (
          bets.map((bet) => (
            <BetCard
              key={bet.id}
              name={bet.creator === address ? 'You' : 'Friend'}
              msg={bet.betDescription}
              betAmmount={Number(formatEther(bet.betAmount))}
              address={bet.creator === address ? bet.opponent : bet.creator}
              expiredBy={new Date(Number(bet.deadline) * 1000)}
              betId={bet.id}
              status={bet.status}
              isCreator={bet.creator === address}
            />
          ))
        )}
      </div>
    </section>
  );
}
