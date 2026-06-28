import { ChevronRight, Clock, Copyright, HeartPulse, Mail, MapPin, Phone, } from "lucide-react";
import Link from "next/link";



export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/*logo*/}
                    <div>
                        <div className="flex item-center gap-2 ">

                            <div className="">
                                <HeartPulse className="w-8 h-8 text-blue-700" size={20} />
                            </div>

                            <h3 className="text-white text-lg font-semibold mb-4">
                                <span className="text-blue-600">
                                    Doctor
                                </span>
                                {" "}Appointment
                            </h3>
                        </div>
                        <p className="text-gray-400 leading-7 ">
                            Book appointments with trusted doctors anytime, anywhere.
                            Fast, secure, and reliable healthcare.
                        </p>
                    </div>
                    {/* Quick Links*/}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
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
                                    />Contact
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
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Contact Us
                        </h3>

                        <div className="space-y-5">

                            <div className="flex items-start gap-3">
                                <MapPin className="text-blue-500 mt-1" size={18} />
                                <span>Beirut, Lebanon</span>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="text-blue-500 mt-1" size={18} />
                                <span>+961 XX XXX XXX</span>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="text-blue-500 mt-1" size={18} />
                                <span>support@doctorappointment.com</span>
                            </div>

                        </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Working Hours
                        </h3>

                        <div className="space-y-5">

                            <div className="flex gap-3">
                                <Clock className="text-blue-500 mt-1" size={18} />
                                <div>
                                    <p className="font-medium text-white">Monday - Friday</p>
                                    <p className="text-gray-400">9:00 AM - 6:00 PM</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Clock className="text-blue-500 mt-1" size={18} />
                                <div>
                                    <p className="font-medium text-white">Saturday</p>
                                    <p className="text-gray-400">9:00 AM - 2:00 PM</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
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
                <div className="border-t border-slate-700 flex justify-between mt-10 pt-2">

                    <p className="flex item-center gap-2">
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