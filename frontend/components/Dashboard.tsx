import BetCard from "./BetCard";

const DummyBets = [
    {
        name: "Alice",
        msg: "Will you beat me in chess?",
        betAmmount: 0.5,
        address: "0x1234567890abcdef1234567890abcdef12345678",
        expiredBy: new Date(Date.now() + 86400000), // 1 day from now
    },
    {
        name: "Bob",
        msg: "Can you run faster than me?",
        betAmmount: 1,
        address: "0xabcdef1234567890abcdef1234567890abcdef12",
        expiredBy: new Date(Date.now() + 172800000), 
    },
];

export default function Dashboard() {
    return (
        <section id="dashboard" className="flex flex-col items-center justify-center gap-4 w-full min-h-screen bg-[#121212] text-white p-8 pt-28">
      <h1 className="text-4xl font-bold">Active Bets</h1>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {DummyBets.map((bet, index) => (
          <BetCard key={index} {...bet} />
        ))}
      </div>
    </section>
    )
}
