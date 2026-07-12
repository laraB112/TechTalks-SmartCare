"use client";

import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, Phone, ChevronDown, Home } from 'lucide-react';
import { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');


  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setAgeError('');
    setGenderError('');
    setPhoneError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      isValid = false;
    }

    if (!age.trim()) {
      setAgeError('Age is required.');
      isValid = false;
    } else if (isNaN(Number(age)) || Number(age) <= 0) {
      setAgeError('Please enter a valid age.');
      isValid = false;
    }

    if (!gender.trim()) {
      setGenderError('Gender is required.');
      isValid = false;
    }

    if (!phone.trim()) {
      setPhoneError('Phone number is required.');
      isValid = false;
    } else if (!/^\+?[0-9\s]{6,15}$/.test(phone.trim())) {
      setPhoneError('Please enter a valid phone number.');
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await fetch("http://TechTalks-SmartCare.test/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          age,
          gender,
          phone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("Registration failed:", data.errors);
        return;
      }
      console.log("user registered:", data.user);
      console.log("token:", data.token);
      router.push("/");
    } catch (error) {
      console.error('Error registering user:', error);
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

      {/* Register Form */}
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
              Welcome to SmartCare
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Create an account to access our services.
            </p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            
            {/* Name */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="name">
                Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  className={`w-full border rounded-lg px-4 py-2.5 sm:py-3 pl-10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    placeholder-gray-400 text-gray-900 text-sm sm:text-base
                    ${nameError ? "border-red-500" : "border-gray-300"}
                  `}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError('');
                  }}
                />
              </div>
              {nameError && (
                <p className="mt-1.5 text-sm text-red-500 text-center">
                  {nameError}
                </p>
              )}
            </div>

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
                    setEmailError('');
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
                    setPasswordError('');
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
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

            {/* Age & Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  type="text"
                  className={`w-full border rounded-lg px-4 py-2.5 sm:py-3 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    placeholder-gray-400 text-gray-900 text-sm sm:text-base
                    ${ageError ? "border-red-500" : "border-gray-300"}
                  `}
                  placeholder="Age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setAgeError('');
                  }}
                />
                {ageError && (
                  <p className="mt-1.5 text-sm text-red-500 text-center">
                    {ageError}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="gender">
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    className={`w-full border rounded-lg px-4 py-2.5 sm:py-3 appearance-none
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      text-gray-900 text-sm sm:text-base bg-white
                      ${genderError ? "border-red-500" : "border-gray-300"}
                    `}
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setGenderError('');
                    }}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {genderError && (
                  <p className="mt-1.5 text-sm text-red-500 text-center">
                    {genderError}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  className={`w-full border rounded-lg px-4 py-2.5 sm:py-3 pl-10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    placeholder-gray-400 text-gray-900 text-sm sm:text-base
                    ${phoneError ? "border-red-500" : "border-gray-300"}
                  `}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                />
              </div>
              {phoneError && (
                <p className="mt-1.5 text-sm text-red-500 text-center">
                  {phoneError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2.5 sm:py-3 rounded-lg cursor-pointer shadow-lg shadow-blue-600/30 text-sm sm:text-base font-medium"
            >
              Create Account
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}