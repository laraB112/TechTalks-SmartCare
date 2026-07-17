"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Loader2,
    AlertCircle,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    Stethoscope,
} from "lucide-react";

interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    city?: string;
    address?: string;
    appointments_count: number;
    last_visit: string | null;
    created_at: string;
}

interface Appointment {
    id: number;
    doctor_name: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
}

export default function PatientDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPatientDetails();
    }, [id]);

    const fetchPatientDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                router.push("/login");
                return;
            }

            const response = await fetch(`http://TechTalks-SmartCare.test/api/admin/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setError("Patient not found");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPatient(data.data || data);

            // Fetch patient's appointments
            const appointmentsResponse = await fetch(
                `http://TechTalks-SmartCare.test/api/admin/patients/${id}/appointments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (appointmentsResponse.ok) {
                const appointmentsData = await appointmentsResponse.json();
                setAppointments(appointmentsData.data || appointmentsData || []);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching patient details:", err);
            setError("Failed to load patient details. Please try again.");
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "accepted": return "bg-blue-100 text-blue-700";
            case "in_progress": return "bg-purple-100 text-purple-700";
            case "completed": return "bg-green-100 text-green-700";
            case "rejected": return "bg-red-100 text-red-700";
            case "cancelled": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return <Clock className="w-4 h-4" />;
            case "accepted": return <CheckCircle className="w-4 h-4" />;
            case "in_progress": return <Clock className="w-4 h-4" />;
            case "completed": return <CheckCircle className="w-4 h-4" />;
            case "rejected": return <XCircle className="w-4 h-4" />;
            case "cancelled": return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600">Loading patient details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 px-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 max-w-md w-full">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Patient not found</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push("/admin/dashboard/patients")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{patient.name}</h1>
                    <p className="text-sm text-gray-500">Patient Details</p>
                </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900 font-medium">{patient.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900 font-medium">{patient.phone || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="text-gray-900 font-medium">{patient.age || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="text-gray-900 font-medium capitalize">{patient.gender || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Total Appointments</p>
                            <p className="text-gray-900 font-medium">{patient.appointments_count || 0}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Last Visit</p>
                            <p className="text-gray-900 font-medium">
                                {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : "Never"}
                            </p>
                        </div>
                    </div>

                    {patient.city && (
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">City</p>
                                <p className="text-gray-900 font-medium">{patient.city}</p>
                            </div>
                        </div>
                    )}

                    {patient.address && (
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-gray-900 font-medium">{patient.address}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Appointments History */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Appointment History
            </h2>

            {appointments.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
                    <p className="text-gray-500">No appointments found for this patient.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Specialty</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                                            {apt.doctor_name}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">
                                            {apt.specialty}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                                            {apt.date}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                                            {apt.time}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                                {getStatusIcon(apt.status)}
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}