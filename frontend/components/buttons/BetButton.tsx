'use client'
import { useAccount, useWriteContract } from 'wagmi';
import { useState } from "react";
import { contractAbi } from '@/utils/contract';
import { contractAddress } from '@/utils/contract';
import { parseEther } from 'viem';

export default function BetButton() {
    const [placingBet, setPlacingBet] = useState(false);
    const [friendAddress, setFriendAddress] = useState('')
    const [ethAmount, setEthAmount] = useState('')
    const [distance, setDistance] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    
    const { address } = useAccount()
    const { writeContract } = useWriteContract()

    const handleBet = async () => {
        try {
            const deadlineDays = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 3600 * 24));
            
            const tx = await writeContract({
                address: contractAddress,
                abi: contractAbi,
                functionName: 'createBet',
                args: [
                    friendAddress,
                    Number(distance),
                    deadlineDays,
                    description
                ],
                value: parseEther(ethAmount),
            })

            console.log('Transaction hash:', tx)
            alert('Bet created successfully! Transaction hash: ' + tx)
            setPlacingBet(false)
        } catch (error: any) {
            console.error('Error creating bet:', error)
            alert('Error creating bet: ' + error.message)
        }
    }

    return (
        <>
            <div className="pt-4">
                <button onClick={() => { setPlacingBet(true) }}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                    Place Bet
                </button>
            </div>

            {placingBet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setPlacingBet(false)}
                    />

                    <div className="relative z-50 w-full max-w-[400px] bg-[#1e1e1e] text-white rounded-lg border mx-4">
                        <div className="flex items-center gap-2 p-4">
                            <div className="grow">
                                <p className="text-sm font-medium">Ready to place your bet?</p>
                                <p className="text-xs text-gray-600 mt-1">Enter your data amount below</p>
                            </div>
                            <button
                                onClick={() => setPlacingBet(false)}
                                className="shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close notification"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-4 pb-4">
                            <p className="flex items-start text-xs text-white mt-4 pl-1 pb-2">Your friend's metamask wallet address</p>
                            <input
                                type="text"
                                value={friendAddress}
                                onChange={(e) => setFriendAddress(e.target.value)}
                                placeholder="Ex: 0x1234567890123456789012345678901234567890"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="flex items-start text-xs text-white mt-4 pl-1 pb-2">ETH amount to bet</p>
                            <input
                                type="text"
                                value={ethAmount}
                                onChange={(e) => setEthAmount(e.target.value)}
                                placeholder="ex: 0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="flex items-start text-xs text-white mt-4 pl-1 pb-2">Distance (in km)</p>
                            <input
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="ex: 1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="flex items-start text-xs text-white mt-4 pl-1 pb-2">Description</p>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="ex: I bet you can't run 10km"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="flex items-start text-xs text-white mt-4 pl-1 pb-2">Deadline</p>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleBet}
                                className="mt-3 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                            >
                                Confirm Bet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}