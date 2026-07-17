"use client"

import Link from "next/link";
import { logout } from "@/app/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartPulse,
  Home,
  LogOut,
  Settings,
  User,
  Users,
  PhoneCall,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  role: "patient" | "doctor" | "admin";
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const patientLinks = [
    {
      title: "Dashboard",
      href: "/patient/dashboard",
      icon: Home,
    },
    {
      title: "My Appointments",
      href: "/patient/dashboard/appointments",
      icon: Calendar,
    },
    {
      title: "Profile",
      href: "/patient/dashboard/profile",
      icon: User,
    },
    {
      title: "Emergency Contact",
      href: "/patient/dashboard/emergency-contact",
      icon: PhoneCall,
    },
  ];

  const doctorLinks = [
    {
      title: "Dashboard",
      href: "/doctor/dashboard",
      icon: Home,
    },
    {
      title: "Patients",
      href: "/doctor/dashboard/patients",
      icon: Users,
    },
    {
      title: "Profile",
      href: "/doctor/dashboard/profile",
      icon: User,
    },
  ];
  const adminLinks = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: Home,
    },
    {
        title: "Doctors",
        href: "/admin/dashboard/doctors",
        icon: Users,
    },
    {
        title: "Patients",
        href: "/admin/dashboard/patients",
        icon: User,
    },
    {
        title: "Appointments",
        href: "/admin/dashboard/appointments",
        icon: Calendar,
    },
    {
     title: "Profile",
        href: "/admin/dashboard/profile",
        icon: User,
    },
];

  const links = role === "patient" ? patientLinks : role === "doctor" ? doctorLinks : adminLinks;
  const router = useRouter();


  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={` fixed left-0 top-0 z-40 flex h-scroll  w-72 flex-col
                      border-r border-gray-200 bg-white transition-transform duration-300
                      ${isOpen ? "translate-x-0" : "-translate-x-full"}
                       md:static md:translate-x-0 md:flex `}
      >

        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-6">
          <div className="">
            <HeartPulse className="h-11 w-11 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-black">
              Smart<span className="text-blue-600">Care</span>
            </h1>

            <p className="text-sm text-gray-500">
              {role === "patient"
                ? "Patient Portal"
                : role === "doctor"
                  ? "Doctor Portal"
                  : "Admin Portal"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                ${active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <Icon size={20} />

                {link.title}
              </Link>
            );
          })}
        </nav>


      </aside>
    </>
  );

}