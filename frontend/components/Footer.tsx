import { ChevronRight, Clock, Copyright, HeartPulse, Mail, MapPin, Phone, } from "lucide-react";
import Link from "next/link";



export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] lg:grid-cols-4 gap-y-10 md:gap-x-16 text-center sm:text-left">
                    {/*logo*/}
                    <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                            <HeartPulse className="w-8 h-8 text-blue-700" size={20} />
                            <h3 className="text-white text-lg font-semibold">
                                <span className="text-blue-600">
                                    Doctor
                                </span>
                                {" "}Appointment
                            </h3>
                        </div>
                        <p className="text-gray-400 leading-7 sm:max-w-xs ">
                            Book appointments with trusted doctors anytime, anywhere.
                            Fast, secure, and reliable healthcare.
                        </p>
                    </div>
                    {/* Quick Links*/}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-center md:text-left text-lg font-semibold mb-4">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-left">
                            <li>
                                <Link href="/" className="hover:text-blue-500 transition-colors duration-300">
                                    <ChevronRight
                                        size={16}
                                        className="text-blue-500 inline-block mr-2 "
                                    />Home
                                </Link>
                            </li>

                            <li>
                                <Link href="/about" className="hover:text-blue-500 transition-colors duration-300">
                                    <ChevronRight
                                        size={16}
                                        className="text-blue-500 inline-block mr-2"
                                    />About
                                </Link>
                            </li>

                            <li>
                                <Link href="/doctors" className="hover:text-blue-500 transition-colors duration-300">
                                    <ChevronRight
                                        size={16}
                                        className="text-blue-500 inline-block mr-2"
                                    />Doctors
                                </Link>
                            </li>

                            <li>
                                <Link href="/contact" className="hover:text-blue-500 transition-colors duration-300">
                                    <ChevronRight
                                        size={16}
                                        className="text-blue-500 inline-block mr-2"
                                    />Our Services
                                </Link>
                            </li>

                            <li>
                                <Link href="/login" className="hover:text-blue-500 transition-colors duration-300">
                                    <ChevronRight
                                        size={16}
                                        className="text-blue-500 inline-block mr-2"
                                    />Login
                                </Link>
                            </li>

                            <li>
                                <Link href="/register" className="hover:text-blue-500 transition-colors duration-300">
                                    <ChevronRight
                                        size={16}
                                        className="text-blue-500 inline-block mr-2"
                                    />Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="w-full ">
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Contact Us
                        </h3>

                        <div className="space-y-5">
                            <div className="flex items-start justify-center sm:justify-start gap-3">
                                <MapPin className="text-blue-500 mt-1" size={18} />
                                <span className="break-words">Beirut, Lebanon</span>
                            </div>

                            <div className="flex items-start justify-center sm:justify-start gap-3">
                                <Phone className="text-blue-500 mt-1" size={18} />
                                <span className="break-words">+961 XX XXX XXX</span>
                            </div>

                            <div className="flex items-start justify-center sm:justify-start  gap-3">
                                <Mail className="text-blue-500 mt-1" size={18} />
                                <span className="break-words">support@doctorappointment.com</span>
                            </div>

                        </div>
                    </div>

                    {/* Working Hours */}
                    <div className="w-full md:justify-self-end lg:justify-self-auto">
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Working Hours
                        </h3>

                        <div className="space-y-5">

                            <div className="flex items-start justify-center sm:justify-start gap-3">
                                <Clock className="text-blue-500 mt-1" size={18} />
                                <div>
                                    <p className="font-medium text-white">Monday - Friday</p>
                                    <p className="text-gray-400">9:00 AM - 6:00 PM</p>
                                </div>
                            </div>

                            <div className="flex items-start justify-center sm:justify-start gap-3">
                                <Clock className="text-blue-500 mt-1" size={18} />
                                <div>
                                    <p className="font-medium text-white">Saturday</p>
                                    <p className="text-gray-400">9:00 AM - 2:00 PM</p>
                                </div>
                            </div>

                            <div className="flex items-start justify-center sm:justify-start gap-3">
                                <Clock className="text-blue-500 mt-1" size={18} />
                                <div>
                                    <p className="font-medium text-white">Sunday</p>
                                    <p className="text-gray-400">Closed</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/*button*/}
                <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    <p className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-center md:text-left text-sm text-gray-300">
                        <Copyright size={16} className="mt-1" /> {new Date().getFullYear()}
                        <span className="text-blue-600"> Doctor Appointment. </span>
                        All rights reserved.
                    </p>
                    <div>
                        <p>Privacy Policy{" "}|{" "}Terms of Service</p>
                    </div>
                </div>

            </div>
        </footer>
    )
}