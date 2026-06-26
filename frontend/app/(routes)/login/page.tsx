"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';


export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Login
                </h1>

                <h2 className="block text-xl font-bold text-blue-600 text-center mb-2">
                    Welcome Back
                </h2>

                <p className="text-center font-medium mb-2">
                    Login to your account to continue
                </p>

                <form className="space-y-4">
                    <div>
                        <label className="block mb-1">Email</label>
                        <div className="relative">
                            <Mail
                                size={20}
                                className="absolute left-2 top-5 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="email"
                                className="w-full border rounded-md px-3 py-2 pl-10"
                                placeholder="Enter your email"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block mb-1">Password</label>
                        <div className="relative">
                            <Lock
                                size={20}
                                className="absolute left-2 top-5 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full border rounded-md px-3 py-2 pl-10"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <p>
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-blue-500 font-medium"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}