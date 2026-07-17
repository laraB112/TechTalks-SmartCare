"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, X, AlertCircle } from "lucide-react";

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

export default function DoctorFormPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const isNew = id === "new";

    const [doctor, setDoctor] = useState<Doctor>({
        id: 0,
        name: "",
        email: "",
        specialty: "",
        experience: 0,
        phone: "",
        isAvailable: true,
        age: 0, // 
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }
        fetchDoctor();
    }, [id, isNew]);

    const fetchDoctor = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                router.push("/login");
                return;
            }

            const response = await fetch(`http://TechTalks-SmartCare.test/api/admin/doctors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setError("Doctor not found");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const doctorData = data.data || data;
            setDoctor({
                ...doctorData,
                specialty: doctorData.specialty || doctorData.specialization?.name || "",
                age: doctorData.age || 0, // 
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching doctor:", err);
            setError("Failed to load doctor. Please try again.");
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setDoctor((prev) => ({ ...prev, [name]: checked }));
        } else {
            setDoctor((prev) => ({
                ...prev,
                [name]: name === "experience" || name === "age" ? Number(value) : value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!doctor.name.trim()) {
                setError("Name is required");
                setSaving(false);
                return;
            }
            if (!doctor.email.trim()) {
                setError("Email is required");
                setSaving(false);
                return;
            }
            if (!doctor.specialty.trim()) {
                setError("Specialty is required");
                setSaving(false);
                return;
            }
            if (doctor.experience < 0) {
                setError("Experience cannot be negative");
                setSaving(false);
                return;
            }
            if (!doctor.phone.trim()) {
                setError("Phone number is required");
                setSaving(false);
                return;
            }
            if (doctor.age && (doctor.age < 1 || doctor.age > 150)) {
                setError("Age must be between 1 and 150");
                setSaving(false);
                return;
            }

            const method = isNew ? "POST" : "PUT";
            const url = isNew
                ? "http://TechTalks-SmartCare.test/api/admin/doctors"
                : `http://TechTalks-SmartCare.test/api/admin/doctors/${id}`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(doctor),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save doctor");
            }

            router.push("/admin/dashboard/doctors");
        } catch (err: any) {
            setError(err.message || "Failed to save doctor");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600">Loading...</span>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push("/admin/dashboard/doctors")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {isNew ? "Add Doctor" : "Edit Doctor"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isNew ? "Add a new doctor to the system" : `Editing ${doctor.name || "doctor"}`}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={doctor.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={doctor.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                            <input
                                type="text"
                                name="specialty"
                                value={doctor.specialty}
                                onChange={handleChange}
                                placeholder="e.g., Cardiology"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                            <input
                                type="number"
                                name="experience"
                                value={doctor.experience}
                                onChange={handleChange}
                                min="0"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={doctor.age || ""}
                                onChange={handleChange}
                                min="1"
                                max="150"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={doctor.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={doctor.isAvailable}
                            onChange={handleChange}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                            Doctor is available
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {isNew ? "Add Doctor" : "Save Changes"}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/admin/dashboard/doctors")}
                            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}