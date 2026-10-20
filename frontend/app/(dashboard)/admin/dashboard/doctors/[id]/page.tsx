"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    Save,
    X,
    AlertCircle,
    UserRound,
    Mail,
    Stethoscope,
    BriefcaseMedical,
    Phone,
    CalendarDays,
    CheckCircle2,
    ShieldCheck,
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

const API_URL = "http://TechTalks-SmartCare.test/api/admin/doctors";
const DOCTORS_PAGE = "/admin/dashboard/doctors";

const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 hover:border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

const labelClassName =
    "mb-2 block text-sm font-semibold text-slate-700";

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
        age: 0,
    });

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchDoctor = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.status === 401 || response.status === 403) {
                router.push("/login");
                return;
            }

            if (response.status === 404) {
                setError("Doctor not found. It may have been removed.");
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to load doctor details.");
            }

            const data = await response.json();
            const doctorData = data.data || data;

            setDoctor({
                id: doctorData.id ?? 0,
                name: doctorData.name ?? "",
                email: doctorData.email ?? "",
                specialty:
                    doctorData.specialty ??
                    doctorData.specialization?.name ??
                    "",
                experience: Number(doctorData.experience ?? 0),
                phone: doctorData.phone ?? "",
                isAvailable:
                    doctorData.isAvailable ??
                    doctorData.is_available ??
                    true,
                age: Number(doctorData.age ?? 0),
            });
        } catch (err) {
            console.error("Error fetching doctor:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load doctor. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        fetchDoctor();
    }, [isNew, fetchDoctor]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setDoctor((prev) => ({ ...prev, [name]: checked }));
            return;
        }

        setDoctor((prev) => ({
            ...prev,
            [name]:
                name === "experience" || name === "age"
                    ? value === ""
                        ? 0
                        : Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const name = doctor.name.trim();
        const email = doctor.email.trim();
        const specialty = doctor.specialty.trim();
        const phone = doctor.phone.trim();

        if (!name || !email || !specialty || !phone) {
            setError("Please complete all required fields.");
            return;
        }

        if (!Number.isFinite(doctor.experience) || doctor.experience < 0) {
            setError("Experience must be zero or greater.");
            return;
        }

        if (
            doctor.age !== undefined &&
            doctor.age !== 0 &&
            (!Number.isFinite(doctor.age) ||
                doctor.age < 1 ||
                doctor.age > 150)
        ) {
            setError("Please enter a valid age between 1 and 150.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                isNew ? API_URL : `${API_URL}/${id}`,
                {
                    method: isNew ? "POST" : "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        ...doctor,
                        name,
                        email,
                        specialty,
                        phone,
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (response.status === 401 || response.status === 403) {
                router.push("/login");
                return;
            }

            if (!response.ok) {
                const validationErrors = data.errors
                    ? Object.values(data.errors).flat().join(" ")
                    : "";

                throw new Error(
                    validationErrors ||
                        data.message ||
                        "Failed to save doctor. Please try again."
                );
            }

            router.push(DOCTORS_PAGE);
        } catch (err) {
            console.error("Error saving doctor:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save doctor. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                    <Loader2 className="h-7 w-7 animate-spin text-teal-700" />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-slate-800">
                        Loading doctor details
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Just a moment...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {/* Page header */}
            <div className="mb-7">
                <button
                    type="button"
                    onClick={() => router.push(DOCTORS_PAGE)}
                    className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-600/10"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to doctors
                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-1.5 w-7 rounded-full bg-teal-600" />
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                                Doctor management
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {isNew ? "Add a new doctor" : "Edit doctor"}
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            {isNew
                                ? "Add a doctor to SmartCare and configure their professional details and availability."
                                : `Update the professional information and availability for ${doctor.name || "this doctor"}.`}
                        </p>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 shadow-sm">
                        <Stethoscope className="h-7 w-7" strokeWidth={1.8} />
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div
                    role="alert"
                    className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800"
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold">Something needs your attention</p>
                        <p className="mt-1 break-words leading-5">{error}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                        className="rounded-lg p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal and contact information */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                            <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Personal information
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Basic details and contact information
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
                        <div>
                            <label htmlFor="name" className={labelClassName}>
                                Full name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    value={doctor.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Dr. Sarah Haddad"
                                    className={`${inputClassName} pl-10`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className={labelClassName}>
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={doctor.email}
                                    onChange={handleChange}
                                    placeholder="doctor@example.com"
                                    className={`${inputClassName} pl-10`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className={labelClassName}>
                                Phone number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    value={doctor.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +961 70 123 456"
                                    className={`${inputClassName} pl-10`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="age" className={labelClassName}>
                                Age <span className="font-normal text-slate-400">(optional)</span>
                            </label>
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    id="age"
                                    type="number"
                                    name="age"
                                    value={doctor.age || ""}
                                    onChange={handleChange}
                                    min="1"
                                    max="150"
                                    placeholder="Enter age"
                                    className={`${inputClassName} pl-10`}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Professional information */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                            <BriefcaseMedical className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Professional details
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Specialty and years of experience
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
                        <div>
                            <label htmlFor="specialty" className={labelClassName}>
                                Medical specialty <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Stethoscope className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="specialty"
                                    type="text"
                                    name="specialty"
                                    value={doctor.specialty}
                                    onChange={handleChange}
                                    placeholder="e.g. Cardiology"
                                    className={`${inputClassName} pl-10`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="experience" className={labelClassName}>
                                Years of experience{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <BriefcaseMedical className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="experience"
                                    type="number"
                                    name="experience"
                                    value={doctor.experience}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g. 5"
                                    className={`${inputClassName} pl-10`}
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                Enter 0 if the doctor has no prior experience.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Availability */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Doctor availability
                                </h2>
                                <p className="mt-1 max-w-lg text-sm leading-5 text-slate-500">
                                    Control whether this doctor is marked as available in the system.
                                </p>
                            </div>
                        </div>

                        <label
                            htmlFor="isAvailable"
                            className="flex cursor-pointer items-center gap-3 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-teal-200 hover:bg-teal-50/50 sm:self-center"
                        >
                            <input
                                type="checkbox"
                                id="isAvailable"
                                name="isAvailable"
                                checked={doctor.isAvailable}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <span
                                aria-hidden="true"
                                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                                    doctor.isAvailable ? "bg-teal-600" : "bg-slate-300"
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                        doctor.isAvailable
                                            ? "translate-x-[22px]"
                                            : "translate-x-0.5"
                                    }`}
                                />
                            </span>
                            <span>
                                <span className="block text-sm font-semibold text-slate-800">
                                    {doctor.isAvailable ? "Available" : "Unavailable"}
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500">
                                    {doctor.isAvailable
                                        ? "Doctor is active"
                                        : "Doctor is inactive"}
                                </span>
                            </span>
                        </label>
                    </div>
                </section>

                {/* Form actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                        <span className="text-red-500">*</span> Required fields
                    </p>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => router.push(DOCTORS_PAGE)}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving doctor...
                                </>
                            ) : (
                                <>
                                    {isNew ? (
                                        <UserRound className="h-4 w-4" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {isNew ? "Add doctor" : "Save changes"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                Doctor information is managed securely through SmartCare.
            </div>
        </div>
    );
}