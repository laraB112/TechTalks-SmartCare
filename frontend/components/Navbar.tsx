"use client";


import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { HeartPulse, Menu, X } from "lucide-react";

export default function Navbar() {

    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLink =
        "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1 transition-all duration-300";

    const activeNavLink =
        "text-blue-600 border-b-2 border-blue-600 pb-1";

    const mobileNavLink =
        "text-gray-700 hover:text-blue-600 transition-colors duration-300 text-center";

    const mobileActiveNavLink =
        "text-blue-600 font-semibold text-center";
    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <HeartPulse className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-black">
                            Smart<span className="text-blue-600">Care</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={pathname === "/" ? activeNavLink : navLink}
                        >
                            Home
                        </Link>

                        <Link
                            href="/patient/dashboard"
                            className={pathname === "/patient/dashboard" ? activeNavLink : navLink}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/about"
                            className={pathname === "/about" ? activeNavLink : navLink}
                        >
                            About Us
                        </Link>


                        <Link
                            href="/doctors"
                            className={pathname === "/doctors" ? activeNavLink : navLink}
                        >
                            Doctors
                        </Link>
                    </div>

                    {/* Desktop Buttons */}
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
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center justify-center p-2 text-gray-700 md:hidden"
                    >
                        {isMenuOpen ? (
                            <X className="w-7 h-7" />
                        ) : (
                            <Menu className="w-7 h-7" />
                        )}
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t shadow-md">
                        <div className="flex flex-col px-6 py-4 space-y-4">
                            <Link
                                href="/"
                                className={pathname === "/" ? mobileActiveNavLink : mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>

                            <Link
                                href="/patient/dashboard"
                                className={pathname === "/patient/dashboard" ? mobileActiveNavLink : mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/about"
                                className={pathname === "/about" ? mobileActiveNavLink : mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/services"
                                className={pathname === "/services" ? mobileActiveNavLink : mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Our Services
                            </Link>
                            <Link
                                href="/doctors"
                                className={pathname === "/doctors" ? mobileActiveNavLink : mobileNavLink}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Doctors
                            </Link>

                            <hr></hr>
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full text-center px-5 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-300"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full text-center px-5 py-2 rounded-md bg-blue-600 text-white border border-blue-600 hover:bg-white hover:text-blue-600 transition duration-300"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}