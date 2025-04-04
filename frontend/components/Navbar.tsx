import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <div className="fixed top-0 left-0 w-full h-16">
            <nav className="flex items-center justify-between w-full px-8 py-4">
                <div>
                    <h1 className="text-2xl font-bold">Project 1</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/" className="hover:text-blue-600 cursor-pointer">Home</Link>
                    <Link href="/about" className="hover:text-blue-600 cursor-pointer">About</Link>

                </div>
            </nav>
        </div>
    );
}