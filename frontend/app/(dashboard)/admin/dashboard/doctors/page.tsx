"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    UserPlus,
    Edit,
    Trash2,
    Search,
    User,
    Loader2,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";

interface Doctor {
    id: number;
    name: string;
    email: string;
    specialty: string;
    experience: number;
    phone: string;
    isAvailable: boolean;
    age?: number;
}

export default function AdminDoctorsPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                router.push("/login");
                return;
            }

            const response = await fetch("http://TechTalks-SmartCare.test/api/admin/doctors", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setError("You don't have permission to view this page");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const doctorsData = data.data || data || [];
            setDoctors(doctorsData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError("Failed to load doctors. Please try again.");
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this doctor?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://TechTalks-SmartCare.test/api/admin/doctors/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete doctor");
            }

            setDoctors(doctors.filter((d) => d.id !== id));
        } catch (error) {
            console.error("Error deleting doctor:", error);
            alert("Failed to delete doctor. Please try again.");
        }
    };

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600">Loading doctors...</span>
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
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Doctors</h1>
                        <p className="text-sm text-gray-500">{doctors.length} doctors total</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/admin/dashboard/doctors/new")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Doctor
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Specialty</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No doctors found</td>
                                </tr>
                            ) : (
                                filteredDoctors.map((doctor) => (
                                    <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-full">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{doctor.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">
                                            {doctor.email || "N/A"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden md:table-cell">
                                            {doctor.specialty || "N/A"}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                doctor.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}>
                                                {doctor.isAvailable ? "Available" : "Unavailable"}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/dashboard/doctors/${doctor.id}`)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doctor.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
                {filteredDoctors.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                        <p className="text-gray-500">No doctors found</p>
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-50 rounded-full">
                                            <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm">{doctor.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 truncate">{doctor.email}</p>
                                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                                </div>
                                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    doctor.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                    {doctor.isAvailable ? "Available" : "Unavailable"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => router.push(`/admin/dashboard/doctors/${doctor.id}`)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(doctor.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}