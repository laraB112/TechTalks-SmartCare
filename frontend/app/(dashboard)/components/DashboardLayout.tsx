
import { ReactNode } from "react";
import SideBar from "./SideBar";
import TopNavBar from "./TopNavBar";

type DashboardLayoutProps = {
  children: ReactNode;
  role: "patient" | "doctor" | "admin";
};

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F4F8FA]">
      <SideBar role={role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavBar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}