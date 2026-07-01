"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const router = useRouter();

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let isValid = true;

        if (!email.trim()) {
            setEmailError("Email is required.");
            isValid = false;
        } else if (!emailRegex.test(email.trim())) {
            setEmailError("Please enter a valid email.");
            isValid = false;
        }

        if (!password.trim()) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
            isValid = false;
        }

        if (isValid) {
            console.log("Login Successful");
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {/*<h1 className="text-2xl font-bold text-center mb-6">
                    Login
                </h1>
                */}
                <h2 className="block text-2xl font-bold text-blue-600 text-center mb-2">
                    Welcome Back
                </h2>

                <p className="text-center font-medium mb-2">
                    Login to your account to continue
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/*Email*/}
                    <div>
                        <label className="block mb-1" htmlFor="email">Email</label>
                        <div className="relative">
                            <Mail
                                size={20}
                                className="absolute left-2 top-5 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="email"
                                type="email"
                                className={`w-full border rounded-md px-3 py-2 pl-10 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                           ${emailError ? "border-red-500" : "border-gray-500"}
                                          `}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError("");
                                }}
                            />
                        </div>
                        {emailError && (
                            <p className="mt-1 text-sm text-red-500 text-center">
                                {emailError}
                            </p>
                        )}
                    </div>
                    {/*Password*/}
                    <div>
                        <label className="block mb-1" htmlFor="password">Password</label>
                        <div className="relative">
                            <Lock
                                size={20}
                                className="absolute left-2 top-5 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className={`w-full border rounded-md px-3 py-2 pl-10
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                     ${passwordError ? "border-red-500" : "border-gray-500"}
                                        `}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="mt-1 text-sm text-red-500 text-center">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md cursor-pointer"
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