"use client";

import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
    todayCount?: number;
    totalCount?: number;
    pendingCount?: number;
    completedCount?: number;
}

export default function DashboardStats({ 
    todayCount = 0, 
    totalCount = 0, 
    pendingCount = 0, 
    completedCount = 0 
}: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
            {/* Today */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{todayCount}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Total */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{totalCount}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Pending */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-xl">
                        <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Completed */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Completed</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{completedCount}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}