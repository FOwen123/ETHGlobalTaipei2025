import Image from "next/image";
import Navbar from "@/components/Navbar";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center w-full min-h-screen">
        <h1 className="text-4xl font-bold">Project 1</h1>
        <p className="text-lg text-gray-400">Make your transactions in web3 easier, by using a prompt.</p>
        <ConnectButton />
      </div>
    </>

  );
}
