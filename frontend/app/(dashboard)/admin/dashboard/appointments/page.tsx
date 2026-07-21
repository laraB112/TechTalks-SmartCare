"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Calendar,
    Search,
    User,
    Loader2,
    AlertCircle,
    ArrowLeft,
    CalendarDays,
} from "lucide-react";

interface Appointment {
    id: number;
    patient_name: string;
    doctor_name: string;
    date: string;
    time: string;
    status: string;
}

export default function AdminAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async (date?: string) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                router.push("/login");
                return;
            }

            
            let url = "http://TechTalks-SmartCare.test/api/admin/appointments";
            if (date) {
                url += `?date=${date}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAppointments(data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("Failed to load appointments. Please try again.");
            setLoading(false);
        }
    };

    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        fetchAppointments(date || undefined);
    };

    const filteredAppointments = appointments.filter((apt) =>
        apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "accepted": return "bg-blue-100 text-blue-700";
            case "in_progress": return "bg-purple-100 text-purple-700";
            case "completed": return "bg-green-100 text-green-700";
            case "rejected": return "bg-red-100 text-red-700";
            case "cancelled": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getTitle = () => {
        if (selectedDate) {
            const date = new Date(selectedDate);
            return `Appointments • ${date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })}`;
        }
        return `All Appointments (${appointments.length} total)`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600">Loading appointments...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 px-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Manage Appointments
                        </h1>
                        <p className="text-sm text-gray-500">{appointments.length} appointments total</p>
                    </div>
                </div>

            
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="text-sm text-gray-900 focus:outline-none"
                        />
                    </div>
                    {selectedDate && (
                        <button
                            onClick={() => {
                                setSelectedDate("");
                                fetchAppointments();
                            }}
                            className="text-sm text-red-500 hover:text-red-700"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

         
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Doctor</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        {selectedDate ? "No appointments found for this date" : "No appointments found"}
                                    </td>
                                </tr>
                            ) : (
                                filteredAppointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-full">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{apt.patient_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">{apt.doctor_name}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden md:table-cell">{apt.date}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{apt.time}</td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}