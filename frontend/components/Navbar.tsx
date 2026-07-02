"use client";


import { usePathname } from "next/navigation";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function Navbar() {

    const pathname = usePathname();
    
    const navLink =
        "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1 transition-all duration-300";

    const activeNavLink =
        "text-blue-600 border-b-2 border-blue-600 pb-1";
    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <HeartPulse className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold">
                            Smart<span className="text-blue-600">Care</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={pathname === "/" ? activeNavLink : navLink}
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            className={pathname === "/about" ? activeNavLink : navLink}
                        >
                            About Us
                        </Link>

                        <Link
                            href="/service"
                            className={pathname === "/services" ? activeNavLink : navLink}
                        >
                           Our Services
                        </Link>

                        <Link
                            href="/doctors"
                            className={pathname === "/doctors" ? activeNavLink : navLink}
                        >
                            Doctors
                        </Link>

                        <Link
                            href="/contact"
                            className={pathname === "/contact" ? activeNavLink : navLink}
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Right Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="px-5 py-2 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition duration-500"
                        >
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="px-5 py-2 rounded-md bg-blue-600 text-white border border-blue-600 hover:bg-white hover:text-blue-600 transition duration-500"
                        >
                            Register
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}