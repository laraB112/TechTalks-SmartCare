
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  UserRound,
  Mail,
  LockKeyhole,
  Phone,
  CalendarDays,
  HeartPulse,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !age || !gender || !phone.trim()) {
      setError("Please complete all the fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
      setError("Please enter a valid age.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            password_confirmation: password,
            age: numericAge,
            gender,
            phone: phone.trim(),
            role: "patient",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "";

        throw new Error(
          validationErrors ||
            data.message ||
            "Registration failed. Please try again."
        );
      }

      setSuccess("Your account was created successfully! Redirecting to login...");

      window.setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 pl-8 pr-2 text-[10px] text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#0E7490] focus:bg-white focus:ring-2 focus:ring-[#0E7490]/15 sm:rounded-xl sm:py-3 sm:pl-10 sm:pr-3 sm:text-sm";

  const labelClass =
    "mb-1 block text-[9px] font-semibold text-slate-700 sm:mb-2 sm:text-sm";

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-x-hidden bg-[#eef7fa] p-2 sm:p-5">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative grid w-full max-w-6xl grid-cols-[0.8fr_1.2fr] overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_25px_80px_-25px_rgba(7,92,112,0.30)] sm:rounded-3xl animate-[fadeIn_.6s_ease-out]">
        {/* Teal welcome panel */}
        <section className="relative flex min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#064958] via-[#075C70] to-[#0E7490] p-3 text-white sm:p-6 lg:p-10">
          <div className="pointer-events-none absolute -right-12 top-20 h-32 w-32 rounded-full border border-white/10 sm:h-56 sm:w-56" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-300/10 blur-xl sm:h-48 sm:w-48" />

          <Link href="/" className="relative z-10 flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 sm:h-10 sm:w-10 sm:rounded-xl">
              <HeartPulse className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <span className="truncate text-xs font-bold tracking-tight sm:text-xl">
              SmartCare
            </span>
          </Link>

          <div className="relative z-10 my-5 sm:my-10">
            <span className="mb-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-medium sm:mb-5 sm:gap-2 sm:px-3 sm:text-xs">
              <Sparkles className="h-3 w-3" />
              Start your journey
            </span>

            <h1 className="text-lg font-bold leading-tight tracking-tight sm:text-3xl lg:text-5xl">
              Better care
              <span className="mt-1 block text-cyan-200">starts here.</span>
            </h1>

            <p className="mt-3 text-[10px] leading-relaxed text-white/75 sm:mt-5 sm:text-sm sm:leading-7 lg:text-base">
              Create your account to organize appointments and make your
              healthcare experience simpler.
            </p>

            <div className="mt-5 hidden space-y-3 sm:block lg:mt-8">
              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.08] p-3 lg:p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <CalendarDays className="h-5 w-5 text-cyan-200" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Easy appointments</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    Manage your visits in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.08] p-3 lg:p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <HeartPulse className="h-5 w-5 text-cyan-200" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Patient-focused care</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    Keep your healthcare journey organized.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-[8px] leading-relaxed text-white/55 sm:text-xs">
            Welcome to a simpler healthcare experience.
          </p>
        </section>

        {/* White registration panel */}
        <section className="flex min-w-0 items-center bg-white p-3 sm:p-6 lg:p-10">
          <div className="mx-auto w-full min-w-0 max-w-lg animate-[slideUp_.55s_ease-out]">
            <div className="mb-4 sm:mb-6">
              <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf7fb] text-[#075C70] sm:mb-3 sm:h-11 sm:w-11">
                <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>

              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create account
              </h2>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500 sm:mt-2 sm:text-sm">
                A few details to get you started.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-3 flex min-w-0 items-start gap-1.5 rounded-lg border border-red-100 bg-red-50 p-2 text-[9px] leading-relaxed text-red-700 sm:mb-4 sm:gap-2 sm:rounded-xl sm:p-3 sm:text-sm"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-3 flex min-w-0 items-start gap-1.5 rounded-lg border border-teal-100 bg-teal-50 p-2 text-[9px] leading-relaxed text-teal-800 sm:mb-4 sm:gap-2 sm:rounded-xl sm:p-3 sm:text-sm"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="break-words">{success}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-2.5 sm:space-y-4">
              <div className="min-w-0">
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor="phone" className={labelClass}>
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <label htmlFor="age" className={labelClass}>
                    Age
                  </label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="gender" className={labelClass}>
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full min-w-0 appearance-none rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-2.5 text-[10px] text-slate-700 outline-none transition duration-200 focus:border-[#0E7490] focus:bg-white focus:ring-2 focus:ring-[#0E7490]/15 sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 pl-8 pr-8 text-[10px] text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#0E7490] focus:bg-white focus:ring-2 focus:ring-[#0E7490]/15 sm:rounded-xl sm:py-3 sm:pl-10 sm:pr-10 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-[#075C70] focus:outline-none focus:ring-2 focus:ring-[#0E7490]/20 sm:right-2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-[8px] text-slate-400 sm:text-[11px]">
                  Use at least 8 characters.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#075C70] to-[#0E7490] px-2 py-2.5 text-[10px] font-semibold text-white shadow-md shadow-[#075C70]/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#075C70]/25 focus:outline-none focus:ring-2 focus:ring-[#0E7490]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:gap-2 sm:rounded-xl sm:py-3 sm:text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create my account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-[9px] leading-relaxed text-slate-500 sm:mt-6 sm:text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#075C70] underline-offset-4 transition hover:text-[#0E7490] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
