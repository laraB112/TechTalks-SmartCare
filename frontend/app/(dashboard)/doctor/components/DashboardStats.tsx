"use client";


import { CalendarDays, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";




export default function DashboardStats() {
    const [todayAppointments, setTodayAppointments] = useState(0);
    const [upcomingAppointments, setUpcomingAppointments] = useState(0);


    const API_URL = "http://techtalks-smartcare.test/api";

    async function getDoctorDashboard() {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/doctor/dashboard`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard stats");
        }

        return response.json();
    }


   useEffect(() => {
    async function loadDashboard() {
        try {
            const data = await getDoctorDashboard();

            setTodayAppointments(data.todayAppointments);
            setUpcomingAppointments(data.upcomingAppointments);
        } catch (error) {
            console.error(error);
        }
    }

    loadDashboard();
}, []);
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4  border bg-white p-6 shadow-sm">
                <div className="rounded-xl bg-blue-100 p-3">
                    <CalendarDays className="text-blue-600" size={28} />
                </div>

                <div>
                    <p className="text-sm text-gray-500">Today's Appointments</p>
                    <h2 className="text-3xl font-bold">{todayAppointments}</h2>
                    <p className="text-sm text-blue-600">Scheduled today</p>
                </div>
            </div>

            <div className="flex items-center gap-4  border bg-white p-6 shadow-sm">
                <div className="rounded-xl bg-purple-100 p-3">
                    <Clock3 className="text-purple-600" size={28} />
                </div>

                <div>
                    <p className="text-sm text-gray-500">Upcoming Appointments</p>
                    <h2 className="text-3xl font-bold">{upcomingAppointments}</h2>
                    <p className="text-sm text-purple-600">Future appointments</p>
                </div>
            </div>
        </div>
    );
}
