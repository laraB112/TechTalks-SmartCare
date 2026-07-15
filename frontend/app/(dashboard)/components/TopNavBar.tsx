"use client";

import { getUser, User, logout } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User as UserIcon, HeartPulse, Home } from "lucide-react";
import Link from "next/link";

type TopNavbarProps = {
  patientName?: string;
};

export default function TopNavbar({ patientName = "patient" }: TopNavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const hours = new Date().getHours();
  let greeting = "";

  if (hours >= 5 && hours < 12) {
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 h-20 border-b border-gray-200 bg-white px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {greeting}, {user?.name || "Patient"}
        </h1>
        <p className="text-sm text-gray-500">Welcome back!</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">

        <Link
          href="/"
          className="text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
          title="Go to Home"
        >
          <Home className="w-5 h-5" />
        </Link>



        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          suppressHydrationWarning  >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}