"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    Search,
    UserRound,
    Loader2,
    AlertCircle,
    ArrowLeft,
    Clock3,
    RefreshCw,
    CheckCircle2,
    Hourglass,
    XCircle,
    CalendarCheck,
    SlidersHorizontal,
    Stethoscope,
    X,
} from "lucide-react";

interface Appointment {
    id: number;
    patient_name: string;
    doctor_name: string;
    date: string;
    time: string;
    status: string;
}

const API_URL = "http://TechTalks-SmartCare.test/api/admin/appointments";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    accepted: "bg-sky-50 text-sky-700 ring-sky-200",
    waiting: "bg-cyan-50 text-cyan-800 ring-cyan-200",
    in_progress: "bg-violet-50 text-violet-700 ring-violet-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
    cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

function formatStatus(status: string) {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: string) {
    if (!date) return "—";

    // Parse YYYY-MM-DD as a local date to avoid timezone shifts.
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

    const parsedDate = match
        ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function AdminAppointmentsPage() {
    const router = useRouter();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const fetchAppointments = useCallback(
        async (date?: string, isRefresh = false) => {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setAppointments([]);
                    setError("Please log in to continue.");
                    router.push("/login");
                    return;
                }

                const url = new URL(API_URL);
                if (date) url.searchParams.set("date", date);

                const response = await fetch(url.toString(), {
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
                    throw new Error(`Request failed: ${response.status}`);
                }

                const data = await response.json();

                const results = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : null;

                if (!results) {
                    throw new Error("Unexpected appointments response.");
                }

                setAppointments(results);
            } catch (err) {
                console.error("Error fetching admin appointments:", err);
                setError("We couldn't load appointments. Please try again.");
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [router]
    );

    useEffect(() => {
        void fetchAppointments();
    }, [fetchAppointments]);

    const filteredAppointments = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return appointments;

        return appointments.filter((appointment) =>
            [appointment.patient_name, appointment.doctor_name]
                .some((value) =>
                    String(value ?? "").toLowerCase().includes(query)
                )
        );
    }, [appointments, searchTerm]);

    const stats = useMemo(() => {
        const counts = {
            total: appointments.length,
            pending: 0,
            inProgress: 0,
            completed: 0,
        };

        appointments.forEach((appointment) => {
            const status = appointment.status?.toLowerCase();

            if (status === "pending") counts.pending++;
            if (status === "in_progress") counts.inProgress++;
            if (status === "completed") counts.completed++;
        });

        return counts;
    }, [appointments]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        void fetchAppointments(date || undefined);
    };

    const handleRefresh = () => {
        void fetchAppointments(selectedDate || undefined, true);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedDate("");
        void fetchAppointments();
    };

    return (
        <main className="mx-auto min-h-screen max-w-[1600px] bg-slate-50/70 p-4 sm:p-6 lg:p-8">
            {/* Page heading */}
            <div className="mb-7">
                <button
                    type="button"
                    onClick={() => router.push("/admin/dashboard")}
                    className="group mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition-colors hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to dashboard
                </button>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064E5D] via-[#086778] to-[#0E8490] p-6 text-white shadow-lg shadow-teal-900/10 sm:p-8">
                    <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-2 -top-10 h-44 w-44 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -bottom-20 right-1/4 h-40 w-40 rounded-full bg-white/[0.04] blur-2xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-teal-50">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                Administration
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Appointment Management
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-relaxed text-teal-50/85 sm:text-base">
                                Monitor hospital appointments, review schedules,
                                and keep track of patient visits in one place.
                            </p>
                        </div>

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 shadow-inner backdrop-blur-sm sm:h-20 sm:w-20">
                            <CalendarCheck className="h-8 w-8 text-white sm:h-9 sm:w-9" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Total appointments"
                    value={stats.total}
                    description={selectedDate ? "For selected date" : "Across all dates"}
                    icon={CalendarDays}
                    iconStyle="bg-teal-50 text-teal-800"
                    accent="bg-teal-500"
                    loading={loading}
                />

                <SummaryCard
                    label="Pending"
                    value={stats.pending}
                    description="Awaiting a decision"
                    icon={Hourglass}
                    iconStyle="bg-amber-50 text-amber-700"
                    accent="bg-amber-400"
                    loading={loading}
                />

                <SummaryCard
                    label="In progress"
                    value={stats.inProgress}
                    description="Currently being handled"
                    icon={Clock3}
                    iconStyle="bg-violet-50 text-violet-700"
                    accent="bg-violet-400"
                    loading={loading}
                />

                <SummaryCard
                    label="Completed"
                    value={stats.completed}
                    description="Visits completed"
                    icon={CheckCircle2}
                    iconStyle="bg-emerald-50 text-emerald-700"
                    accent="bg-emerald-400"
                    loading={loading}
                />
            </div>

            {/* Appointments section */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-14px_rgba(15,76,92,0.16)]">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            {selectedDate
                                ? `Appointments · ${formatDate(selectedDate)}`
                                : "All appointments"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {loading
                                ? "Updating appointment records..."
                                : `${filteredAppointments.length} ${
                                    filteredAppointments.length === 1
                                        ? "record"
                                        : "records"
                                }${searchTerm ? " matching your search" : ""}`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <label className="relative min-w-0 flex-1 sm:flex-none">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(event) => handleDateChange(event.target.value)}
                                aria-label="Filter appointments by date"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition hover:border-teal-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10 sm:w-auto"
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading || refreshing}
                            title="Refresh appointments"
                            aria-label="Refresh appointments"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Search and filter tools */}
                <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by patient or doctor name..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            aria-label="Search appointments by patient or doctor"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10"
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                            <SlidersHorizontal className="h-4 w-4" />
                            {selectedDate ? "Date filter active" : "All dates"}
                        </span>

                        {(selectedDate || searchTerm) && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="whitespace-nowrap text-sm font-semibold text-teal-800 transition hover:text-teal-950"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div
                        role="alert"
                        className="m-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 sm:m-6"
                    >
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800">
                                Unable to load appointments
                            </p>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="mt-2 text-sm font-semibold text-red-800 underline underline-offset-4 hover:text-red-950"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse text-left">
                        <thead className="bg-white">
                            <tr className="border-b border-slate-200">
                                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-6">
                                    Patient
                                </th>
                                <th className="hidden px-5 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:table-cell sm:px-6">
                                    Doctor
                                </th>
                                <th className="hidden px-5 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 md:table-cell md:px-6">
                                    Date
                                </th>
                                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-6">
                                    Time
                                </th>
                                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-6">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-teal-700" />
                                        <p className="text-sm font-medium text-slate-700">
                                            Loading appointments
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Retrieving appointment records...
                                        </p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                                        Appointment records could not be displayed.
                                    </td>
                                </tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
                                                {searchTerm ? (
                                                    <Search className="h-5 w-5" />
                                                ) : (
                                                    <CalendarDays className="h-5 w-5" />
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {searchTerm
                                                    ? "No matching appointments"
                                                    : selectedDate
                                                        ? "No appointments for this date"
                                                        : "No appointments yet"}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {searchTerm
                                                    ? "Try another patient or doctor name."
                                                    : "Appointments will appear here when records are available."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAppointments.map((apt) => {
                                    const status = apt.status?.toLowerCase() || "";

                                    return (
                                        <tr
                                            key={apt.id}
                                            className="group transition-colors duration-150 hover:bg-teal-50/40"
                                        >
                                            <td className="px-5 py-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800 ring-1 ring-teal-100 transition-colors group-hover:bg-teal-100">
                                                        <UserRound className="h-4.5 w-4.5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-800">
                                                            {apt.patient_name || "Unknown patient"}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            Appointment #{apt.id}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500 sm:hidden">
                                                            {apt.doctor_name || "Doctor not assigned"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="hidden px-5 py-4 sm:table-cell sm:px-6">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Stethoscope className="h-4 w-4 shrink-0 text-slate-400" />
                                                    <span>{apt.doctor_name || "Not assigned"}</span>
                                                </div>
                                            </td>

                                            <td className="hidden whitespace-nowrap px-5 py-4 text-sm text-slate-600 md:table-cell md:px-6">
                                                {formatDate(apt.date)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700 sm:px-6">
                                                <span className="inline-flex items-center gap-2">
                                                    <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                                                    {apt.time || "—"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 sm:px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                                                        STATUS_STYLES[status] ||
                                                        "bg-slate-100 text-slate-600 ring-slate-200"
                                                    }`}
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {formatStatus(status || "unknown")}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!loading && !error && (
                    <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredAppointments.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {appointments.length}
                            </span>{" "}
                            appointments
                        </p>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-teal-800 transition hover:text-teal-950 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh records
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    iconStyle,
    accent,
    loading,
}: {
    label: string;
    value: number;
    description: string;
    icon: React.ElementType;
    iconStyle: string;
    accent: string;
    loading: boolean;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-12px_rgba(15,76,92,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_12px_28px_-12px_rgba(15,76,92,0.22)]">
            <div className={`absolute inset-x-0 top-0 h-0.5 ${accent} opacity-70 transition-opacity group-hover:opacity-100`} />

            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>

                    {loading ? (
                        <div className="mt-3 h-9 w-14 animate-pulse rounded-lg bg-slate-100" />
                    ) : (
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            {value.toLocaleString()}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-slate-400">{description}</p>
                </div>

                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconStyle}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}