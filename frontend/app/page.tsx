import Image from "next/image";
import Navbar from "@/components/Navbar";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center w-full min-h-screen mt-5">
        <h1 className="font-bold text-[3rem]">Friendly Bets, <br /> <span className="text-[#FFD700]">Real Stakes</span></h1>
        <p className="text-lg text-gray-400">Find your friends, make a <span className="text-blue-500">challenge</span>, <br /> bet your <span className="text-blue-500">money</span>, and race to the finish line!</p>
      </div>
      <Dashboard />
    </>
  );
}
