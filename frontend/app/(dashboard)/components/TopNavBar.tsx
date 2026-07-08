"use client";

import { getUser, User } from "@/app/lib/auth";
import { useEffect, useState } from "react";

export default function TopNavbar() {

  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    setUser(getUser());
  }, []);


  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back!
        </p>
      </div>
      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {user?.name?.charAt(0)}
          </div>
          <div className="hidden text-left md:block">

            <p className="font-semibold text-gray-800">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}