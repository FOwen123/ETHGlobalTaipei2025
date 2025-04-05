'use client'
import { useState } from "react";

export default function BetButton() {
    const [placingBet, setPlacingBet] = useState(false);

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
                            <p className=" flex items-start text-xs text-white mt-4 pl-1 pb-2">Your friend's metamask wallet address</p>
                            <input
                                type="string"
                                placeholder="Ex: 0x1234567890123456789012345678901234567890"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className=" flex items-start text-xs text-white mt-4 pl-1 pb-2">ETH ammount to bet</p>
                            <input
                                type="string"
                                placeholder="ex: 0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className=" flex items-start text-xs text-white mt-4 pl-1 pb-2">Distance</p>
                            <input
                                type="string"
                                placeholder="ex: 1km"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className=" flex items-start text-xs text-white mt-4 pl-1 pb-2">Description</p>
                            <input
                                type="string"
                                placeholder="ex: I bet you can't run 10km"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className=" flex items-start text-xs text-white mt-4 pl-1 pb-2">Deadline</p>
                            <input
                                type="datetime-local"
                                placeholder="ex: 08/04/2025"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
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