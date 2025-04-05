import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function Navbar() {
    return (
        <div className="fixed top-0 left-0 w-full h-16">
            <nav className="flex items-center justify-between w-full px-8 py-4">
                <div className="flex items-center gap-2">
                    <Image src="/betcha_2.png" alt="logo" width={50} height={50} />
                    <h1 className="text-3xl font-bold">Betcha</h1>
                </div>
                <div className="flex items-center gap-4">
                    <a href="#dashboard" className="hover:text-blue-600 cursor-pointer font-bold">Dashboard</a>
                    <a href="#home" className="hover:text-blue-600 cursor-pointer font-bold">Home</a>
                    <ConnectButton />
                </div>
            </nav>
        </div>
    );
}