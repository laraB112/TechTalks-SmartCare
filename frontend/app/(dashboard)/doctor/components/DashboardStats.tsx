
"use client";

import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
  todayCount?: number;
  totalCount?: number;
  pendingCount?: number;
  completedCount?: number;
}

const stats = [
  {
    label: "Today's Appointments",
    key: "todayCount",
    icon: Calendar,
    description: "Scheduled for today",
  },
  {
    label: "Total Appointments",
    key: "totalCount",
    icon: Users,
    description: "All appointments",
  },
  {
    label: "Pending",
    key: "pendingCount",
    icon: Clock,
    description: "Awaiting completion",
  },
  {
    label: "Completed",
    key: "completedCount",
    icon: CheckCircle,
    description: "Successfully completed",
  },
] as const;

export default function DashboardStats({
  todayCount = 0,
  totalCount = 0,
  pendingCount = 0,
  completedCount = 0,
}: DashboardStatsProps) {
  const values = {
    todayCount,
    totalCount,
    pendingCount,
    completedCount,
  };

  return (
    <div className="mb-7 grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0E8498]/30 hover:shadow-lg hover:shadow-[#075C70]/[0.06] sm:p-5 lg:p-6"
          >
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#075C70] to-[#36B7C6] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Mobile: icon above the text. Desktop: icon beside it. */}
            <div className="mb-3 flex items-center justify-between sm:hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FA] text-[#075C70]">
                <Icon size={17} strokeWidth={1.9} />
              </div>
            </div>

            <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                  {stat.label}
                </p>

                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {values[stat.key]}
                </p>

                <p className="mt-2 text-[10px] leading-4 text-slate-400 sm:text-xs">
                  {stat.description}
                </p>
              </div>

              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FA] text-[#075C70] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#075C70] group-hover:text-white sm:flex sm:h-11 sm:w-11">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.9} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
