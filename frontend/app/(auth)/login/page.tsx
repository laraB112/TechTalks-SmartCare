"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
        } else if (password.length < 7) {
            setPasswordError("Password must be at least 7 characters.");
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await fetch("http://TechTalks-SmartCare.test/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Login failed:", data.message);
                return;
            }

            console.log("user logged in:", data.user);
            console.log("token:", data.token);

            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            const role = data.user.role;
            if (role === 'doctor') {
                router.push('/doctor/dashboard');
            } else if (role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/patient/dashboard');
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
            
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ 
                    backgroundImage: "url('https://thumbs.dreamstime.com/b/doctor-medical-background-24834402.jpg')" 
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
            </div>

            {/* Login Form */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg px-3 sm:px-0">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100/80">
                    
                    {/* Home Icon (Top Left) */}
                    <div className="flex justify-between items-start mb-2">
                        <Link 
                            href="/" 
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            aria-label="Back to Home"
                        >
                            <Home className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
                            Welcome Back
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Login to your account to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    className={`w-full border rounded-lg px-4 py-2.5 sm:py-3 pl-10 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        placeholder-gray-400 text-gray-900 text-sm sm:text-base
                                        ${emailError ? "border-red-500" : "border-gray-300"}
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
                                <p className="mt-1.5 text-sm text-red-500 text-center">
                                    {emailError}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full border rounded-lg px-4 py-2.5 sm:py-3 pl-10
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        placeholder-gray-400 text-gray-900 text-sm sm:text-base
                                        ${passwordError ? "border-red-500" : "border-gray-300"}
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-1.5 text-sm text-red-500 text-center">
                                    {passwordError}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2.5 sm:py-3 rounded-lg cursor-pointer shadow-lg shadow-blue-600/30 text-sm sm:text-base font-medium"
                        >
                            Login
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-4 sm:mt-6 text-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            Don't have an account?{" "}
                            <Link 
                                href="/register" 
                                className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}