"use client";

import { getUser, User } from "@/app/lib/auth";
import { useEffect, useState } from "react";

type TopNavbarProps = {
  patientName?: string;
};

export default function TopNavbar({ patientName = "patient"} : TopNavbarProps) {

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

  return (
    <header className="sticky top-0 z-10 h-20 
                       border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 text-center md:text-start pt-3">
          {greeting},  {user ? user.name : "Patient"}
        </h1>
        <p className="text-sm text-gray-500 text-center md:text-start">
          Welcome back!
        </p>
      </div>
    </header>
  );
}