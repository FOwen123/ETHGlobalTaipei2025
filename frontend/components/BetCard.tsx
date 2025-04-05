interface BetCardProps {
    name: string;
    msg: string;
    betAmmount: number;
    address: string;
    expiredBy: Date;
}

export default function BetCard({ msg, betAmmount, expiredBy, name, address }: BetCardProps) {
    return (
        <div className="bg-[#1e1e1e] px-6 py-4 rounded-lg w-full shadow-md">
            <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold">{name}, bets you!</p>
                        <p className="text-gray-400">"{msg}"</p>
                        <p className="text-gray-400">Expired by: {expiredBy.toLocaleString()}</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <span className="text-purple-500 text-sm bg-[#161616] px-3 py-1 rounded-full">
                        {betAmmount} ETH
                    </span>
                    <button className="bg-orange-500 hover:bg-orange-600 transition px-5 py-2 rounded-lg text-white font-semibold">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
