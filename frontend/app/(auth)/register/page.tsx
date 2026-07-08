"use client";

import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, Phone, ChevronDown } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 sm:p-8 shadow-md">
        <h2 className="block text-center text-2xl font-bold text-blue-600 mb-2">
          Welcome to SmartCare
        </h2>
        <p className="text-center font-light mb-4">
          Create an account to access our services.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block mb-1" htmlFor="name">Name</label>
            <div className="relative">
              <User size={20} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                id="name"
                type="text"
                className={`w-full border rounded-md px-3 py-2 pl-10 focus:outline-none 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          placeholder-transparent sm:placeholder-gray-400
                          ${nameError ? "border-red-500" : "border-gray-500"}
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
              <p className="text-red-500 text-sm mt-1 text-center">
                {nameError}
              </p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block mb-1" htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={20} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                id="email"
                type="email"
                className={`w-full border rounded-md px-3 py-2 pl-10 focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-transparent sm:placeholder-gray-400
                         ${emailError ? "border-red-500" : "border-gray-500"}
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
              <p className="text-red-500 text-sm mt-1 text-center">
                {emailError}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`w-full border rounded-md px-3 py-2 pl-10 focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-transparent sm:placeholder-gray-400
                         ${passwordError ? "border-red-500" : "border-gray-500"}
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
                className="absolute right-2 top-2.5 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {passwordError}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block mb-1" htmlFor="age">Age</label>
              <div>
                <input
                  id="age"
                  type="text"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-transparent sm:placeholder-gray-400
                         ${ageError ? "border-red-500" : "border-gray-500"}
                `}
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setAgeError('');
                  }}
                />
              </div>
              {ageError && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {ageError}
                </p>
              )}
            </div>
            <div>
                <label className="block mb-1" htmlFor="gender">Gender</label>
              <div className="relative">
                <select
                  id="gender"
                  className={`w-full border rounded-md px-3 py-2.5 focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         appearance-none 
                         ${genderError ? "border-red-500" : "border-gray-500"}
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
                  size={20}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {genderError && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {genderError}
                </p>
              )}
            </div>
          </div>
          {/* Phone Number */}
          <div>
              <label className="block mb-1" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <Phone
                size={20}
                className="absolute left-2 top-2.5 text-gray-400"
              />
              <input
                id="phone"
                type="tel"
                className={`w-full border rounded-md px-3 py-2 pl-10 focus:outline-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       placeholder-transparent sm:placeholder-gray-400
                       ${phoneError ? "border-red-500" : "border-gray-500"}
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
              <p className="text-red-500 text-sm mt-1 text-center">
                {phoneError}
              </p>
            )}
          </div>


          {/* Clicked button */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 hover:bg-blue-700 transition duration-200 py-2 text-white cursor-pointer "
          >
            Create Account
          </button>
        </form>
        <div className="mt-3 text-center">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
