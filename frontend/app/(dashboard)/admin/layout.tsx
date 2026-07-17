"use client";

import Sidebar from "../components/SideBar";
import TopNavBar from "../components/TopNavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="admin" />
      <div className="flex flex-1 flex-col">
        <TopNavBar />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}