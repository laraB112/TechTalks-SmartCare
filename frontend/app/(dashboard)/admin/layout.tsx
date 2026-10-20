"use client";

import Sidebar from "../components/SideBar";
import TopNavBar from "../components/TopNavBar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#F5F8FA] text-slate-800">
            {/* Admin sidebar */}
            <Sidebar role="admin" />

            {/* Main application area */}
            <div className="flex min-w-0 flex-1 flex-col">
                <TopNavBar />

                <main className="min-w-0 flex-1">
                    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>

                {/* Subtle footer */}
                <footer className="border-t border-slate-200/80 bg-white/70 px-4 py-3 sm:px-6 lg:px-8">
                    <p className="text-center text-xs text-slate-400 sm:text-left">
                        SmartCare Admin Portal
                    </p>
                </footer>
            </div>
        </div>
    );
}