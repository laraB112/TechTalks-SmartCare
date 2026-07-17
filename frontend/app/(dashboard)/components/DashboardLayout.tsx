
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
    <div className="flex min-h-screen bg-gray-100">
      <SideBar role={role} />

      <div className="flex flex-1 flex-col">
        <TopNavBar/>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}