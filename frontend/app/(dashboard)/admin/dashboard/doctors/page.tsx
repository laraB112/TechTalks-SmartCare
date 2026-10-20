"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    UserPlus,
    Pencil,
    Trash2,
    Search,
    UserRound,
    Loader2,
    AlertCircle,
    ArrowLeft,
    Stethoscope,
    Mail,
    Phone,
    RefreshCw,
    X,
    CheckCircle2,
    UserCheck,
    UserX,
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

export default function AdminDoctorsPage() {
    const router = useRouter();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [notice, setNotice] = useState("");

    const fetchDoctors = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
                return;
            }

            if (response.status === 403) {
                setError("You don't have permission to view this page.");
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to load doctors. Please try again.");
            }

            const data = await response.json();
            const doctorsData = data.data ?? data;

            if (!Array.isArray(doctorsData)) {
                throw new Error("The server returned an unexpected doctors response.");
            }

            setDoctors(
                doctorsData.map((doctor: Record<string, unknown>) => ({
                    ...doctor,
                    id: Number(doctor.id),
                    name: String(doctor.name ?? ""),
                    email: String(doctor.email ?? ""),
                    specialty: String(
                        doctor.specialty ??
                        (doctor.specialization as { name?: string } | undefined)?.name ??
                        ""
                    ),
                    experience: Number(doctor.experience ?? 0),
                    phone: String(doctor.phone ?? ""),
                    isAvailable:
                        doctor.isAvailable === true ||
                        doctor.isAvailable === 1 ||
                        doctor.is_available === true ||
                        doctor.is_available === 1 ||
                        doctor.isAvailable === "1" ||
                        doctor.is_available === "1",
                }))
            );
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load doctors. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleDelete = async (doctor: Doctor) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${doctor.name || "this doctor"}? This action cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingId(doctor.id);
        setError(null);
        setNotice("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API_URL}/${doctor.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete doctor.");
            }

            setDoctors((previous) =>
                previous.filter((item) => item.id !== doctor.id)
            );
            setNotice(`${doctor.name || "Doctor"} was deleted successfully.`);
        } catch (err) {
            console.error("Error deleting doctor:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete doctor. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filteredDoctors = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return doctors;

        return doctors.filter((doctor) =>
            [
                doctor.name,
                doctor.email,
                doctor.specialty,
                doctor.phone,
            ].some((value) => value?.toLowerCase().includes(query))
        );
    }, [doctors, searchTerm]);

    const availableCount = doctors.filter(
        (doctor) => doctor.isAvailable
    ).length;

    const unavailableCount = doctors.length - availableCount;

    const getInitials = (name: string) => {
        const words = name.trim().split(/\s+/).filter(Boolean);

        if (words.length === 0) return "DR";

        return words
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                    <Loader2 className="h-7 w-7 animate-spin text-teal-700" />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-slate-800">
                        Loading doctors
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Fetching your medical team...
                    </p>
                </div>
            </div>
        );
    }

    if (error && doctors.length === 0) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
                <div className="w-full rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                        Unable to load doctors
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        {error}
                    </p>
                    <button
                        onClick={() => fetchDoctors()}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {/* Page header */}
            <div className="mb-7">
                <button
                    type="button"
                    onClick={() => router.push("/admin/dashboard")}
                    className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-600/10"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                </button>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-1.5 w-7 rounded-full bg-teal-600" />
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                                Admin workspace
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Doctor management
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            Manage your medical team, review specialties, and
                            control doctor availability.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push(`${DOCTORS_PAGE}/new`)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-teal-600/20"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add doctor
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SummaryCard
                    label="Total doctors"
                    value={doctors.length}
                    description="Registered medical team"
                    icon={Users}
                    iconClass="bg-teal-50 text-teal-700"
                />
                <SummaryCard
                    label="Available"
                    value={availableCount}
                    description="Marked as available"
                    icon={UserCheck}
                    iconClass="bg-emerald-50 text-emerald-700"
                />
                <SummaryCard
                    label="Unavailable"
                    value={unavailableCount}
                    description="Currently inactive"
                    icon={UserX}
                    iconClass="bg-slate-100 text-slate-600"
                />
            </div>

            {/* Notifications */}
            {error && (
                <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="flex-1">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        aria-label="Dismiss error"
                        className="rounded-lg p-1 hover:bg-red-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {notice && (
                <div
                    role="status"
                    className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="flex-1">{notice}</p>
                    <button
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notification"
                        className="rounded-lg p-1 hover:bg-emerald-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Directory panel */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Medical team
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {filteredDoctors.length === doctors.length
                                ? `${doctors.length} ${doctors.length === 1 ? "doctor" : "doctors"} in your directory`
                                : `${filteredDoctors.length} of ${doctors.length} doctors shown`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative min-w-0 sm:w-80">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search name, specialty, email..."
                                aria-label="Search doctors"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => fetchDoctors(true)}
                            disabled={refreshing}
                            aria-label="Refresh doctors"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Doctor
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Specialty
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Availability
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16">
                                        <EmptyState
                                            hasSearch={Boolean(searchTerm.trim())}
                                            onClear={() => setSearchTerm("")}
                                            onAdd={() =>
                                                router.push(`${DOCTORS_PAGE}/new`)
                                            }
                                        />
                                    </td>
                                </tr>
                            ) : (
                                filteredDoctors.map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className="transition-colors hover:bg-teal-50/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex min-w-[190px] items-center gap-3">
                                                <DoctorAvatar
                                                    name={doctor.name}
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {doctor.name || "Unnamed doctor"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        ID #{doctor.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <Stethoscope className="h-4 w-4 shrink-0 text-teal-600" />
                                                <span>
                                                    {doctor.specialty || "Not specified"}
                                                </span>
                                            </div>
                                            <p className="ml-6 mt-1 text-xs text-slate-400">
                                                {doctor.experience}{" "}
                                                {doctor.experience === 1
                                                    ? "year"
                                                    : "years"}{" "}
                                                experience
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <p className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                    <span className="max-w-[210px] truncate">
                                                        {doctor.email || "No email"}
                                                    </span>
                                                </p>
                                                <p className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                    {doctor.phone || "No phone"}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                available={doctor.isAvailable}
                                            />
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.push(
                                                            `${DOCTORS_PAGE}/${doctor.id}`
                                                        )
                                                    }
                                                    title="Edit doctor"
                                                    aria-label={`Edit ${doctor.name}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-600/10"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doctor)}
                                                    disabled={deletingId === doctor.id}
                                                    title="Delete doctor"
                                                    aria-label={`Delete ${doctor.name}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingId === doctor.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile and tablet cards */}
                <div className="space-y-3 p-4 md:hidden">
                    {filteredDoctors.length === 0 ? (
                        <EmptyState
                            hasSearch={Boolean(searchTerm.trim())}
                            onClear={() => setSearchTerm("")}
                            onAdd={() => router.push(`${DOCTORS_PAGE}/new`)}
                        />
                    ) : (
                        filteredDoctors.map((doctor) => (
                            <article
                                key={doctor.id}
                                className="rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <DoctorAvatar name={doctor.name} />

                                    <div className="min-w-0 flex-1">
                                        <h3 className="break-words text-sm font-bold text-slate-900">
                                            {doctor.name || "Unnamed doctor"}
                                        </h3>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                                            <Stethoscope className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                                            {doctor.specialty || "Not specified"}
                                        </p>
                                        <div className="mt-3">
                                            <StatusBadge
                                                available={doctor.isAvailable}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                                    <p className="flex items-start gap-2 break-all text-sm text-slate-600">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        {doctor.email || "No email provided"}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                        {doctor.phone || "No phone provided"}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {doctor.experience}{" "}
                                        {doctor.experience === 1
                                            ? "year"
                                            : "years"}{" "}
                                        experience · ID #{doctor.id}
                                    </p>
                                </div>

                                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(`${DOCTORS_PAGE}/${doctor.id}`)
                                        }
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(doctor)}
                                        disabled={deletingId === doctor.id}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {deletingId === doctor.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* Footer */}
                {doctors.length > 0 && (
                    <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredDoctors.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {doctors.length}
                            </span>{" "}
                            doctors
                        </p>
                        <p className="text-xs text-slate-400">
                            SmartCare · Doctor directory
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    iconClass,
}: {
    label: string;
    value: number;
    description: string;
    icon: React.ElementType;
    iconClass: string;
}) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-400">
                        {description}
                    </p>
                </div>
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconClass}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function DoctorAvatar({ name }: { name: string }) {
    const initials =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase() || "DR";

    return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 text-sm font-bold text-teal-800">
            {initials}
        </div>
    );
}

function StatusBadge({ available }: { available: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                available
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-100 text-slate-600"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    available ? "bg-emerald-500" : "bg-slate-400"
                }`}
            />
            {available ? "Available" : "Unavailable"}
        </span>
    );
}

function EmptyState({
    hasSearch,
    onClear,
    onAdd,
}: {
    hasSearch: boolean;
    onClear: () => void;
    onAdd: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                {hasSearch ? (
                    <Search className="h-6 w-6" />
                ) : (
                    <UserRound className="h-6 w-6" />
                )}
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
                {hasSearch ? "No matching doctors" : "No doctors yet"}
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                {hasSearch
                    ? "Try another name, specialty, email, or phone number."
                    : "Add your first doctor to start building your medical team."}
            </p>

            {hasSearch ? (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                    Clear search
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                    <UserPlus className="h-4 w-4" />
                    Add doctor
                </button>
            )}
        </div>
    );
}