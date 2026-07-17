"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Search,
    User,
    Loader2,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";

interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    appointments_count: number;
    last_visit: string | null;
}

export default function AdminPatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                router.push("/login");
                return;
            }

            const response = await fetch("http://TechTalks-SmartCare.test/api/admin/patients", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPatients(data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setError("Failed to load patients. Please try again.");
            setLoading(false);
        }
    };
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600">Loading patients...</span>
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
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Patients</h1>
                    <p className="text-sm text-gray-500">{patients.length} patients total</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Phone</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Age/Gender</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Visits</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden xl:table-cell">Last Visit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No patients found</td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-50 rounded-full">
                                                    <User className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{patient.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">{patient.email}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden md:table-cell">{patient.phone}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden lg:table-cell">{patient.age} / {patient.gender}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{patient.appointments_count}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden xl:table-cell">
                                            {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : "Never"}
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