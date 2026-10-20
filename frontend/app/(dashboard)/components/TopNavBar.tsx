"use client";

import { getUser, User, logout } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  UserRound,
  Home,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

type TopNavbarProps = {
  patientName?: string;
};

export default function TopNavbar({
  patientName = "Patient",
}: TopNavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const role = user?.role?.toLowerCase() || "patient";

  const roleLabels: Record<string, string> = {
    patient: "Patient",
    doctor: "Doctor",
    admin: "Admin",
  };

  const roleLabel = roleLabels[role] || "Patient";
  const portalLabel = `${roleLabel} portal`;

  const profilePath =
    role === "doctor"
      ? "/doctor/dashboard/profile"
      : role === "admin"
        ? "/admin/dashboard/profile"
        : "/patient/dashboard/profile";

  const hours = new Date().getHours();

  const greeting =
    hours >= 5 && hours < 12
      ? "Good morning"
      : hours >= 12 && hours < 17
        ? "Good afternoon"
        : "Good evening";

  const displayName = user?.name || patientName;

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "P";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#DCEEF3] bg-white/95 shadow-[0_3px_16px_rgba(7,92,112,0.035)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-3 px-3 sm:min-h-[80px] sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="min-w-0 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0E7490] sm:text-[11px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0E7490]" />
            {portalLabel}
          </div>

          <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
            {greeting},{" "}
            <span className="text-[#075C70]">
              {displayName.split(" ")[0]}
            </span>
            <span className="text-[#0E7490]">.</span>
          </h1>

          <p className="mt-0.5 hidden text-xs text-slate-500 sm:block sm:text-sm">
            {role === "doctor"
              ? "Welcome back! Manage your schedule and patients."
              : role === "admin"
                ? "Welcome back! Manage your SmartCare platform."
                : "Welcome back! Your health journey matters."}
          </p>
        </div>

        {/* Navigation actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            href="/"
            title="Go to home"
            aria-label="Go to home"
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:border-[#DCEEF3] hover:bg-[#EAF7FB] hover:text-[#075C70] focus:outline-none focus:ring-4 focus:ring-cyan-50 sm:h-11 sm:w-11"
          >
            <Home className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-y-0.5" />
          </Link>

          {/* User profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfile((current) => !current)}
              aria-expanded={showProfile}
              aria-label={`Toggle ${roleLabel.toLowerCase()} profile`}
              className={`group flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-all duration-200 sm:gap-2.5 sm:px-3 ${
                showProfile
                  ? "border-[#B9DFE8] bg-[#EAF7FB]"
                  : "border-transparent hover:border-[#DCEEF3] hover:bg-[#F5FAFC]"
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#075C70] to-[#0E7490] text-xs font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10 sm:text-sm">
                {initials}
              </div>

              <div className="hidden min-w-0 text-left md:block">
                <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                  {displayName}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {roleLabel}
                </p>
              </div>

              <ChevronDown
                className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 md:block ${
                  showProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfile && (
              <>
                <button
                  type="button"
                  aria-label="Close profile menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowProfile(false)}
                />

                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 origin-top-right animate-[profileIn_.18s_ease-out_both] overflow-hidden rounded-2xl border border-[#DCEEF3] bg-white shadow-[0_15px_45px_rgba(7,48,61,0.14)]">
                  <div className="bg-gradient-to-br from-[#EAF7FB] to-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#075C70] to-[#0E7490] text-sm font-bold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {displayName}
                        </p>
                        <p className="mt-1 text-xs text-[#0E7490]">
                          SmartCare {roleLabel.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href={profilePath}
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#EAF7FB] hover:text-[#075C70]"
                    >
                      <UserRound className="h-4 w-4" />
                      Profile
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="group hidden items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/70 px-3.5 py-2.5 text-sm font-semibold text-rose-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-50 sm:flex"
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes profileIn {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(*) {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </header>
  );
}