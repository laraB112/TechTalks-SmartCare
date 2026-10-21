
import { ReactNode } from "react";
import Sidebar from "./SideBar";
import TopNavbar from "./TopNavBar";

type DashboardLayoutProps = {
  children: ReactNode;
  role: "patient" | "doctor" | "admin";
};

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F4F8FA] md:flex">
      <Sidebar role={role} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopNavbar />

        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7 xl:p-8">
          <div className="mx-auto w-full max-w-[1600px] min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
