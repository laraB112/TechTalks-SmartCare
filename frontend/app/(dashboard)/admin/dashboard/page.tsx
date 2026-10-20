"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    UserPlus,
    Pencil,
    Trash2,
    Search,
    Stethoscope,
    Loader2,
    AlertCircle,
    CheckCircle2,
    UserCheck,
    UserX,
    BriefcaseMedical,
    CalendarDays,
    RefreshCw,
    X,
    ArrowRight,
    Mail,
} from "lucide-react";

interface Doctor {
    id: number;
    name: string;
    email: string;
    specialty: string;
    experience: number;
    phone: string;
    isAvailable: boolean;
}

const API_URL = "http://TechTalks-SmartCare.test/api/admin/doctors";
const DOCTORS_PAGE = "/admin/dashboard/doctors";

export default function AdminDashboardPage() {
    const router = useRouter();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
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

            setError("");

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
                setError("You don't have permission to access this dashboard.");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load doctors. Please try again.");
            }

            const data = await response.json();
            const result = data.data ?? data;

            if (!Array.isArray(result)) {
                throw new Error("The server returned an unexpected response.");
            }

            setDoctors(
                result.map((item: Record<string, unknown>) => ({
                    id: Number(item.id),
                    name: String(item.name ?? ""),
                    email: String(item.email ?? ""),
                    specialty: String(
                        item.specialty ??
                        (item.specialization as { name?: string } | undefined)?.name ??
                        ""
                    ),
                    experience: Number(item.experience ?? 0),
                    phone: String(item.phone ?? ""),
                    isAvailable:
                        item.isAvailable === true ||
                        item.isAvailable === 1 ||
                        item.isAvailable === "1" ||
                        item.is_available === true ||
                        item.is_available === 1 ||
                        item.is_available === "1",
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
        if (
            !window.confirm(
                `Are you sure you want to delete ${doctor.name || "this doctor"}? This action cannot be undone.`
            )
        ) {
            return;
        }

        setDeletingId(doctor.id);
        setError("");
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

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete doctor.");
            }

            setDoctors((current) =>
                current.filter((item) => item.id !== doctor.id)
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
            ].some((value) => value.toLowerCase().includes(query))
        );
    }, [doctors, searchTerm]);

    const availableCount = doctors.filter(
        (doctor) => doctor.isAvailable
    ).length;

    const unavailableCount = doctors.length - availableCount;

    const specialtyCount = new Set(
        doctors
            .map((doctor) => doctor.specialty.trim().toLowerCase())
            .filter(Boolean)
    ).size;

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                    <Loader2 className="h-7 w-7 animate-spin text-teal-700" />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-slate-800">
                        Preparing your dashboard
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Loading your medical team...
                    </p>
                </div>
            </div>
        );
    }

    if (error && doctors.length === 0) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
                <div className="w-full rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                        Unable to load dashboard
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
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
        <div className="mx-auto w-full max-w-[1500px] space-y-7">
            {/* Welcome header */}
            <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#075C70] via-[#08758A] to-[#0E7490] px-5 py-7 shadow-sm sm:px-8 sm:py-9">
                <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-2 -top-10 -z-10 h-44 w-44 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-48 w-48 rounded-full bg-white/[0.04]" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                            SmartCare administration
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Admin dashboard
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50/85 sm:text-base">
                            An overview of your medical team, doctor availability,
                            and specialties — all in one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => fetchDoctors(true)}
                            disabled={refreshing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push(`${DOCTORS_PAGE}/new`)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50"
                        >
                            <UserPlus className="h-4 w-4" />
                            Add doctor
                        </button>
                    </div>
                </div>

                <div className="relative mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs font-medium text-teal-50/90 sm:text-sm">
                    <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {doctors.length} registered{" "}
                        {doctors.length === 1 ? "doctor" : "doctors"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        {availableCount} available
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <BriefcaseMedical className="h-4 w-4" />
                        {specialtyCount}{" "}
                        {specialtyCount === 1 ? "specialty" : "specialties"}
                    </span>
                </div>
            </section>

            {/* Feedback */}
            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="flex-1">{error}</p>
                    <button
                        type="button"
                        onClick={() => setError("")}
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
                    className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="flex-1">{notice}</p>
                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notification"
                        className="rounded-lg p-1 hover:bg-emerald-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Dashboard statistics */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                        Team overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Current doctor directory statistics
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total doctors"
                        value={doctors.length}
                        description="Registered in SmartCare"
                        icon={Users}
                        iconClass="bg-teal-50 text-teal-700"
                        accent="bg-teal-600"
                    />
                    <StatCard
                        label="Available"
                        value={availableCount}
                        description="Marked as available"
                        icon={UserCheck}
                        iconClass="bg-emerald-50 text-emerald-700"
                        accent="bg-emerald-500"
                    />
                    <StatCard
                        label="Unavailable"
                        value={unavailableCount}
                        description="Marked as unavailable"
                        icon={UserX}
                        iconClass="bg-slate-100 text-slate-600"
                        accent="bg-slate-400"
                    />
                    <StatCard
                        label="Specialties"
                        value={specialtyCount}
                        description="Distinct specialties"
                        icon={BriefcaseMedical}
                        iconClass="bg-cyan-50 text-cyan-700"
                        accent="bg-cyan-600"
                    />
                </div>
            </section>

            {/* Doctor directory */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Doctor directory
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Search and manage your registered doctors.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative sm:w-80">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search doctors..."
                                aria-label="Search doctors by name, specialty, email, or phone"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push(DOCTORS_PAGE)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                        >
                            View all doctors
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

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
                                    Email
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-14">
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
                                filteredDoctors.slice(0, 8).map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className="transition-colors hover:bg-teal-50/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <DoctorAvatar name={doctor.name} />
                                                <div className="min-w-0">
                                                    <p className="max-w-[200px] truncate text-sm font-semibold text-slate-900">
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
                                                {doctor.specialty || "Not specified"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex max-w-[240px] items-center gap-2 text-sm text-slate-600">
                                                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                                <span className="truncate">
                                                    {doctor.email || "No email"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge available={doctor.isAvailable} />
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
                                                    aria-label={`Edit ${doctor.name}`}
                                                    title="Edit doctor"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doctor)}
                                                    disabled={deletingId === doctor.id}
                                                    aria-label={`Delete ${doctor.name}`}
                                                    title="Delete doctor"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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

                {/* Mobile doctor cards */}
                <div className="space-y-3 p-4 md:hidden">
                    {filteredDoctors.length === 0 ? (
                        <EmptyState
                            hasSearch={Boolean(searchTerm.trim())}
                            onClear={() => setSearchTerm("")}
                            onAdd={() => router.push(`${DOCTORS_PAGE}/new`)}
                        />
                    ) : (
                        filteredDoctors.slice(0, 8).map((doctor) => (
                            <article
                                key={doctor.id}
                                className="rounded-xl border border-slate-200 p-4 transition hover:border-teal-200"
                            >
                                <div className="flex items-start gap-3">
                                    <DoctorAvatar name={doctor.name} />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="break-words text-sm font-bold text-slate-900">
                                            {doctor.name || "Unnamed doctor"}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {doctor.specialty || "Not specified"}
                                        </p>
                                        <div className="mt-3">
                                            <StatusBadge available={doctor.isAvailable} />
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-3 flex items-start gap-2 break-all border-t border-slate-100 pt-3 text-sm text-slate-500">
                                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                    {doctor.email || "No email provided"}
                                </p>

                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(`${DOCTORS_PAGE}/${doctor.id}`)
                                        }
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-50 px-3 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(doctor)}
                                        disabled={deletingId === doctor.id}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
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

                {filteredDoctors.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {Math.min(filteredDoctors.length, 8)}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredDoctors.length}
                            </span>{" "}
                            matching doctors
                        </p>

                        {filteredDoctors.length > 8 && (
                            <button
                                type="button"
                                onClick={() => router.push(DOCTORS_PAGE)}
                                className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-teal-700 transition hover:text-teal-900 sm:self-auto"
                            >
                                View complete directory
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* Quick navigation */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <QuickLink
                    icon={Users}
                    title="Manage all doctors"
                    description="Add, edit, search, and manage doctor profiles."
                    onClick={() => router.push(DOCTORS_PAGE)}
                />
                <QuickLink
                    icon={CalendarDays}
                    title="Manage appointments"
                    description="Review scheduled appointments and their status."
                    onClick={() => router.push("/admin/dashboard/appointments")}
                />
            </section>
        </div>
    );
}

function StatCard({
    label,
    value,
    description,
    icon: Icon,
    iconClass,
    accent,
}: {
    label: string;
    value: number;
    description: string;
    icon: ElementType;
    iconClass: string;
    accent: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
            <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
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
            .map((part) => part[0])
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

function QuickLink({
    icon: Icon,
    title,
    description,
    onClick,
}: {
    icon: ElementType;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-200 hover:shadow-md sm:p-6"
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                    {description}
                </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700" />
        </button>
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
        <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                {hasSearch ? (
                    <Search className="h-6 w-6" />
                ) : (
                    <Stethoscope className="h-6 w-6" />
                )}
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
                {hasSearch ? "No matching doctors" : "No doctors registered yet"}
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                {hasSearch
                    ? "Try a different search term or clear your search."
                    : "Add a doctor to start building your medical team."}
            </p>

            {hasSearch ? (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
                >
                    Clear search
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                    <UserPlus className="h-4 w-4" />
                    Add doctor
                </button>
            )}
        </div>
    );
}