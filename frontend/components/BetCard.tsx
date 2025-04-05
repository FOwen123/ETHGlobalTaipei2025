import { useWriteContract } from 'wagmi';
import { contractAbi, contractAddress } from '@/utils/contract';
import { parseEther } from 'viem';

interface BetCardProps {
    name: string;
    msg: string;
    betAmmount: number;
    address: string;
    expiredBy: Date;
    betId: number;
    status: number;
    isCreator: boolean;
}

export default function BetCard({ msg, betAmmount, expiredBy, name, address, betId, status, isCreator }: BetCardProps) {
    const { writeContract } = useWriteContract();

    const handleAcceptBet = async () => {
        try {
            await writeContract({
                address: contractAddress,
                abi: contractAbi,
                functionName: 'acceptBet',
                args: [BigInt(betId)],
                value: parseEther(betAmmount.toString())
            });
        } catch (error) {
            console.error('Error accepting bet:', error);
            alert('Failed to accept bet');
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 0:
                return isCreator ? 'Pending' : 'Accept';
            case 1:
                return 'Active';
            default:
                return 'Unknown';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 0:
                return isCreator ? 'bg-yellow-500' : 'bg-orange-500';
            case 1:
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-[#1e1e1e] px-6 py-4 rounded-lg w-full shadow-md">
            <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold">{name} {isCreator ? 'challenged someone!' : 'challenged you!'}</p>
                        <p className="text-gray-400">"{msg}"</p>
                        <p className="text-gray-400">Expired by: {expiredBy.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm mt-1">Address: {address}</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <span className="text-purple-500 text-sm bg-[#161616] px-3 py-1 rounded-full">
                        {betAmmount} ETH
                    </span>
                    {status === 0 && !isCreator ? (
                        <button 
                            onClick={handleAcceptBet}
                            className={`${getStatusColor()} hover:opacity-90 transition px-5 py-2 rounded-lg text-white font-semibold`}
                        >
                            Accept
                        </button>
                    ) : (
                        <span className={`${getStatusColor()} px-5 py-2 rounded-lg text-white font-semibold`}>
                            {getStatusText()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
