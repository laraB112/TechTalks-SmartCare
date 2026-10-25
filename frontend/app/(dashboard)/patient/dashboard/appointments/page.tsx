
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  CalendarPlus,
  CheckCircle2,
  XCircle,
  CircleDot,
  AlertCircle,
  Trash2,
  EyeOff,
  RefreshCw,
  Stethoscope,
  CalendarCheck,
  Hourglass,
  Search,
  X,
  ClipboardList,
  Check,
  AlertTriangle,
  MessageSquareText,
} from "lucide-react";

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  rejection_reason?: string | null;
  reschedule_rejection_reason?: string | null;
  queue_position?: number;
  doctor: {
    id: number;
    user: {
      name: string;
    };
  };
}

const API_URL = "http://TechTalks-SmartCare.test/api";

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const datePart = date.split("T")[0];
  const parsed = new Date(`${datePart}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return datePart;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (time?: string) => {
  if (!time) return "Not available";

  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = match[2];

  if (hours > 23) return time;

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes} ${suffix}`;
};

const normalizeStatus = (status?: string) =>
  (status || "unknown").toLowerCase().replace(/[\s-]+/g, "_");

const getStatusConfig = (status: string) => {
  const normalized = normalizeStatus(status);

  const statuses: Record<
    string,
    { label: string; icon: typeof Clock3; className: string }
  > = {
    pending: {
      label: "Pending",
      icon: Hourglass,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    accepted: {
      label: "Confirmed",
      icon: CheckCircle2,
      className: "bg-cyan-50 text-cyan-800 border-cyan-200",
    },
    waiting: {
      label: "Waiting",
      icon: Clock3,
      className: "bg-sky-50 text-sky-700 border-sky-200",
    },
    in_progress: {
      label: "In Progress",
      icon: CircleDot,
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle2,
      className: "bg-teal-50 text-teal-800 border-teal-200",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-rose-50 text-rose-700 border-rose-200",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      className: "bg-slate-100 text-slate-600 border-slate-200",
    },
  };

  return (
    statuses[normalized] || {
      label: status || "Unknown",
      icon: CircleDot,
      className: "bg-slate-100 text-slate-600 border-slate-200",
    }
  );
};

const isActiveStatus = (status: string) =>
  ["pending", "accepted", "waiting"].includes(normalizeStatus(status));

const isUpcomingAppointment = (appointment: Appointment) =>
  appointment.date?.split("T")[0] >= getLocalDate() &&
  !["completed", "cancelled", "rejected"].includes(
    normalizeStatus(appointment.status)
  );

export default function AppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [rescheduling, setRescheduling] = useState<number | null>(null);
  const [hiding, setHiding] = useState<number | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reasonTitle, setReasonTitle] = useState("Rejection reason");

  const [cancelReason, setCancelReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    void fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/appointments`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];

      setAppointments(items);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("We couldn't load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openReasonModal = (
    reason: string | null | undefined,
    title = "Rejection reason"
  ) => {
    if (!reason?.trim()) return;

    setSelectedReason(reason.trim());
    setReasonTitle(title);
    setShowReasonModal(true);
  };

  const getRejectionReason = (appointment: Appointment) => {
    if (normalizeStatus(appointment.status) !== "rejected") return null;

    return (
      appointment.rejection_reason?.trim() ||
      appointment.reschedule_rejection_reason?.trim() ||
      null
    );
  };

  const canCancel = (appointment: Appointment) =>
    isActiveStatus(appointment.status) &&
    appointment.date?.split("T")[0] >= getLocalDate();

  const canReschedule = (appointment: Appointment) =>
    isActiveStatus(appointment.status) &&
    appointment.date?.split("T")[0] >= getLocalDate();

  const upcomingAppointments = appointments
    .filter(isUpcomingAppointment)
    .sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      return dateComparison || (a.time || "").localeCompare(b.time || "");
    });

  const nextAppointment = upcomingAppointments[0] || null;

  const pendingCount = appointments.filter((appointment) =>
    ["pending", "accepted", "waiting"].includes(
      normalizeStatus(appointment.status)
    )
  ).length;

  const filteredAppointments = appointments
    .filter((appointment) => {
      const doctorName = appointment.doctor?.user?.name || "";
      const matchesSearch = doctorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const status = normalizeStatus(appointment.status);

      const matchesFilter =
        filter === "all" ||
        (filter === "upcoming" && isUpcomingAppointment(appointment)) ||
        (filter === "completed" && status === "completed") ||
        (filter === "cancelled" &&
          ["cancelled", "rejected"].includes(status));

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateComparison = b.date.localeCompare(a.date);
      return dateComparison || (b.time || "").localeCompare(a.time || "");
    });

  const canHide = (appointment: Appointment) =>
    ["completed", "cancelled", "rejected"].includes(
      normalizeStatus(appointment.status)
    );

  const hideAppointment = async (appointment: Appointment) => {
    if (!canHide(appointment)) return;

    const confirmed = window.confirm(
      "Hide this appointment from your appointment history? The record will still be available to administrators."
    );

    if (!confirmed) return;

    setHiding(appointment.id);
    setActionError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/patient/appointments/${appointment.id}/hide`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to hide appointment.");
      }

      setAppointments((current) =>
        current.filter((item) => item.id !== appointment.id)
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Couldn't hide this appointment. Please try again."
      );
    } finally {
      setHiding(null);
    }
  };

  const openCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason("");
    setActionError("");
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;

    setCancelling(selectedAppointment.id);
    setActionError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/patient/appointments/${selectedAppointment.id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: cancelReason.trim() || "Cancelled by patient",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel appointment.");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );

      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Couldn't cancel the appointment. Please try again."
      );
    } finally {
      setCancelling(null);
    }
  };

  const openRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate("");
    setNewTime("");
    setAvailableSlots([]);
    setActionError("");
    setShowRescheduleModal(true);
  };

  const fetchAvailableSlots = async (date: string) => {
    if (!selectedAppointment || !date) return;

    setFetchingSlots(true);
    setNewTime("");
    setAvailableSlots([]);
    setActionError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/doctors/${selectedAppointment.doctor.id}/available-slots?date=${encodeURIComponent(date)}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load available slots.");
      }

      setAvailableSlots(
        Array.isArray(data.available_slots) ? data.available_slots : []
      );
    } catch (err) {
      console.error("Error fetching slots:", err);
      setActionError(
        err instanceof Error
          ? err.message
          : "Could not load available slots."
      );
    } finally {
      setFetchingSlots(false);
    }
  };

  const confirmReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    setRescheduling(selectedAppointment.id);
    setActionError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/appointments/${selectedAppointment.id}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: newDate,
            time: newTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reschedule appointment.");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? {
              ...appointment,
              date: newDate,
              time: newTime,
              status: "pending",
              rejection_reason: null,
              reschedule_rejection_reason: null,
            }
            : appointment
        )
      );

      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");
      setAvailableSlots([]);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Couldn't reschedule. Please try again."
      );
    } finally {
      setRescheduling(null);
    }
  };

  const closeCancelModal = () => {
    if (cancelling !== null) return;
    setShowCancelModal(false);
    setSelectedAppointment(null);
    setActionError("");
  };

  const closeRescheduleModal = () => {
    if (rescheduling !== null) return;
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setNewDate("");
    setNewTime("");
    setAvailableSlots([]);
    setActionError("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF7FB]">
          <CalendarDays className="h-7 w-7 text-[#075C70]" />
          <LoaderCircle className="absolute -right-2 -top-2 h-6 w-6 animate-spin text-[#0E7490]" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-800">
            Loading your appointments
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Just a moment while we get everything ready.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-lg items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-rose-100 bg-white p-7 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-9">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <AlertCircle className="h-7 w-7 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          <button
            onClick={() => void fetchAppointments()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#075C70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064957] focus:outline-none focus:ring-4 focus:ring-cyan-100"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-[#F5FAFC] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Page heading */}
        <section className="animate-[fadeUp_.45s_ease-out_both]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0E7490]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0E7490]" />
                Patient portal
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2.1rem]">
                My Appointments<span className="text-[#0E7490]">.</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                Keep track of your visits, manage your schedule, and stay on
                top of your care.
              </p>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <div className="group min-w-0 overflow-hidden animate-[fadeUp_.45s_ease-out_.05s_both] rounded-2xl border border-[#DCEEF3] bg-white p-3 shadow-[0_4px_20px_rgba(15,23,42,0.025)] transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5">
            <div className="flex min-w-0 items-start justify-between gap-2 sm:items-center sm:gap-3">
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-medium leading-4 text-slate-500 sm:text-sm">
                  Total appointments
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {appointments.length}
                </p>
                <p className="mt-1 break-words text-[10px] leading-4 text-slate-400 sm:text-xs">
                  Your appointment history
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF7FB] transition duration-300 sm:h-8 sm:w-8">
                <ClipboardList className="h-3.5 w-3.5 shrink-0 text-[#075C70] sm:h-4 sm:w-4" />
              </div>
            </div>
          </div>

          <div className="group min-w-0 overflow-hidden animate-[fadeUp_.45s_ease-out_.1s_both] rounded-2xl border border-[#DCEEF3] bg-white p-3 shadow-[0_4px_20px_rgba(15,23,42,0.025)] transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5">
            <div className="flex min-w-0 items-start justify-between gap-2 sm:items-center sm:gap-3">
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-medium leading-4 text-slate-500 sm:text-sm">
                  Upcoming visits
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {upcomingAppointments.length}
                </p>
                <p className="mt-1 break-words text-[10px] leading-4 text-slate-400 sm:text-xs">
                  Scheduled ahead
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-50 transition duration-300 sm:h-8 sm:w-8">
                <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-cyan-700 sm:h-4 sm:w-4" />
              </div>
            </div>
          </div>

          <div className="group col-span-2 min-w-0 overflow-hidden animate-[fadeUp_.45s_ease-out_.15s_both] rounded-2xl border border-[#DCEEF3] bg-white p-3 shadow-[0_4px_20px_rgba(15,23,42,0.025)] transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5 lg:col-span-1">
            <div className="flex min-w-0 items-start justify-between gap-2 sm:items-center sm:gap-3">
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-medium leading-4 text-slate-500 sm:text-sm">
                  Awaiting visit
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {pendingCount}
                </p>
                <p className="mt-1 break-words text-[10px] leading-4 text-slate-400 sm:text-xs">
                  Pending or confirmed
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 transition duration-300 sm:h-8 sm:w-8">
                <Hourglass className="h-3.5 w-3.5 shrink-0 text-amber-600 sm:h-4 sm:w-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Featured upcoming appointment */}
        {nextAppointment && (
          <section className="animate-[fadeUp_.5s_ease-out_.12s_both]">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#064957] via-[#075C70] to-[#0E7490] p-5 text-white shadow-[0_16px_45px_rgba(7,92,112,0.17)] sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-2 -top-10 -z-10 h-44 w-44 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-20 left-[42%] -z-10 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-50">
                    Your next visit
                  </div>

                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    You&apos;re on the schedule.
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-cyan-50/80">
                    Here&apos;s the next appointment coming up in your care
                    journey.
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <Stethoscope className="h-6 w-6 text-cyan-100" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white sm:text-lg">
                        Dr. {nextAppointment.doctor?.user?.name || "Your doctor"}
                      </p>
                      <p className="mt-0.5 text-sm text-cyan-50/70">
                        Appointment #{nextAppointment.id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-3 sm:px-3.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-cyan-100" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-cyan-100/70">
                          Date
                        </p>
                        <p className="mt-0.5 break-words text-xs font-semibold sm:text-sm">
                          {formatDate(nextAppointment.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-3 sm:px-3.5">
                      <Clock3 className="h-4 w-4 shrink-0 text-cyan-100" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-cyan-100/70">
                          Time
                        </p>
                        <p className="mt-0.5 break-words text-xs font-semibold sm:text-sm">
                          {formatTime(nextAppointment.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-white/15 pt-5 sm:justify-start lg:min-w-[190px] lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <div>
                    <p className="text-xs text-cyan-50/70 lg:text-right">
                      Current status
                    </p>
                    <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold">
                      <span className="h-2 w-2 rounded-full bg-cyan-200" />
                      {getStatusConfig(nextAppointment.status).label}
                    </span>
                  </div>

                  {nextAppointment.queue_position != null && (
                    <div className="text-right">
                      <p className="text-xs text-cyan-50/70">Queue position</p>
                      <p className="mt-1 text-2xl font-bold">
                        #{nextAppointment.queue_position}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Appointment list */}
        <section className="animate-[fadeUp_.5s_ease-out_.18s_both]">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Appointment history
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View and manage all your scheduled visits.
              </p>
            </div>
            <span className="self-start rounded-full border border-[#DCEEF3] bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 sm:self-auto">
              {filteredAppointments.length}{" "}
              {filteredAppointments.length === 1 ? "appointment" : "appointments"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#DCEEF3] bg-white shadow-[0_6px_25px_rgba(15,23,42,0.025)] sm:rounded-3xl">
            {/* Search and filters */}
            <div className="space-y-4 border-b border-slate-100 p-4 sm:p-5 lg:flex lg:items-center lg:justify-between lg:gap-5 lg:space-y-0">
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by doctor name..."
                  aria-label="Search appointments by doctor name"
                  className="w-full rounded-xl border border-slate-200 bg-[#FAFCFD] py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0E7490] focus:bg-white focus:ring-4 focus:ring-cyan-50"
                />
              </div>

              <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-xl bg-slate-100/80 p-1">
                {[
                  { id: "all", label: "All" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "completed", label: "Completed" },
                  { id: "cancelled", label: "Cancelled" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 sm:text-sm ${filter === item.id
                        ? "bg-white text-[#075C70] shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {actionError && !showCancelModal && !showRescheduleModal && (
              <div
                role="alert"
                className="mx-4 mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-5"
              >
                {actionError}
              </div>
            )}

            {filteredAppointments.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-8 sm:py-16">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF7FB]">
                  {appointments.length === 0 ? (
                    <CalendarDays className="h-7 w-7 text-[#0E7490]" />
                  ) : (
                    <Search className="h-7 w-7 text-[#0E7490]" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {appointments.length === 0
                    ? "Your schedule starts here"
                    : "No matching appointments"}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {appointments.length === 0
                    ? "You haven't booked a visit yet. Find a doctor and schedule your first appointment."
                    : "Try a different search or filter to find the appointment you're looking for."}
                </p>
                {appointments.length === 0 ? (
                  <button
                    onClick={() =>
                      router.push("/patient/dashboard/book-appointment")
                    }
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#075C70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064957] focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Book your first appointment
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("all");
                    }}
                    className="mt-5 text-sm font-semibold text-[#0E7490] hover:text-[#075C70]"
                  >
                    Clear search and filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-hidden lg:block">
                  <table className="w-full table-fixed text-left">
                    <thead>
                      <tr className="bg-[#F7FBFC]">
                        <th className="w-[30%] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 xl:px-6">
                          Doctor
                        </th>
                        <th className="w-[23%] px-3 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 xl:px-5">
                          Date &amp; time
                        </th>
                        <th className="w-[19%] px-3 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 xl:px-5">
                          Status
                        </th>
                        <th className="w-[28%] px-3 py-4 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 xl:px-5">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.map((appointment) => {
                        const status = getStatusConfig(appointment.status);
                        const StatusIcon = status.icon;
                        const rejectionReason = getRejectionReason(appointment);

                        return (
                          <tr
                            key={appointment.id}
                            className="group transition-colors duration-200 hover:bg-[#F8FCFD]"
                          >
                            <td className="px-4 py-4 xl:px-6">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCEEF3] bg-[#EAF7FB] transition duration-200 group-hover:scale-105">
                                  <Stethoscope className="h-[18px] w-[18px] text-[#075C70]" />
                                </div>
                                <div className="min-w-0">
                                  <p className="break-words text-sm font-semibold text-slate-800">
                                    Dr. {appointment.doctor?.user?.name || "Unknown"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-400">
                                    Appointment #{appointment.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-4 xl:px-5">
                              <p className="text-sm font-semibold text-slate-700">
                                {formatDate(appointment.date)}
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                                <Clock3 className="h-3.5 w-3.5" />
                                {formatTime(appointment.time)}
                              </p>
                            </td>

                            <td className="px-3 py-4 xl:px-5">
                              <span
                                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                              >
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.label}
                              </span>
                            </td>

                            <td className="px-3 py-4 xl:px-5">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                {rejectionReason && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openReasonModal(
                                        rejectionReason,
                                        appointment.reschedule_rejection_reason?.trim()
                                          ? "Reschedule rejection reason"
                                          : "Appointment rejection reason"
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                  >
                                    <MessageSquareText className="h-3.5 w-3.5" />
                                    View reason
                                  </button>
                                )}

                                {canReschedule(appointment) && (
                                  <button
                                    onClick={() => openRescheduleModal(appointment)}
                                    disabled={rescheduling === appointment.id}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCEEF3] bg-white px-3 py-2 text-xs font-semibold text-[#075C70] transition hover:border-[#0E7490] hover:bg-[#EAF7FB] disabled:opacity-50"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Reschedule
                                  </button>
                                )}

                                {canCancel(appointment) && (
                                  <button
                                    onClick={() => openCancelModal(appointment)}
                                    disabled={cancelling === appointment.id}
                                    aria-label={`Cancel appointment ${appointment.id}`}
                                    className="inline-flex items-center justify-center rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-600 transition hover:border-rose-200 hover:bg-rose-100 disabled:opacity-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}

                                {canHide(appointment) && (
                                  <button
                                    onClick={() => void hideAppointment(appointment)}
                                    disabled={hiding === appointment.id}
                                    aria-label={`Hide appointment ${appointment.id}`}
                                    title="Hide from my history"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                                  >
                                    {hiding === appointment.id ? (
                                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                    Hide
                                  </button>
                                )}

                                {!rejectionReason &&
                                  !canReschedule(appointment) &&
                                  !canCancel(appointment) &&
                                  !canHide(appointment) && (
                                    <span className="text-xs text-slate-400">
                                      No actions
                                    </span>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile and tablet appointment cards */}
                <div className="grid grid-cols-1 gap-2 p-2 sm:p-3 lg:hidden">
                  {filteredAppointments.map((appointment, index) => {
                    const status = getStatusConfig(appointment.status);
                    const StatusIcon = status.icon;
                    const rejectionReason = getRejectionReason(appointment);

                    return (
                      <article
                        key={appointment.id}
                        style={{
                          animationDelay: `${Math.min(index * 50, 300)}ms`,
                        }}
                        className="animate-[fadeUp_.4s_ease-out_both] rounded-xl border border-slate-200/80 bg-white p-3 transition duration-200 hover:border-[#B9DFE8]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF7FB]">
                              <Stethoscope className="h-4 w-4 text-[#075C70]" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold text-slate-800">
                                Dr. {appointment.doctor?.user?.name || "Unknown"}
                              </h3>
                              <p className="mt-1 text-xs text-slate-400">
                                Appointment #{appointment.id}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="my-3 grid grid-cols-2 gap-2">
                          <div className="min-w-0 rounded-lg bg-[#F6FAFB] p-2">
                            <div className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                              <CalendarDays className="h-3.5 w-3.5" />
                              Date
                            </div>
                            <p className="break-words text-[11px] font-semibold text-slate-700">
                              {formatDate(appointment.date)}
                            </p>
                          </div>
                          <div className="min-w-0 rounded-lg bg-[#F6FAFB] p-2">
                            <div className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                              <Clock3 className="h-3.5 w-3.5" />
                              Time
                            </div>
                            <p className="break-words text-[11px] font-semibold text-slate-700">
                              {formatTime(appointment.time)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${status.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </span>

                          {appointment.queue_position != null && (
                            <span className="text-xs font-semibold text-[#0E7490]">
                              Queue #{appointment.queue_position}
                            </span>
                          )}
                        </div>

                        {rejectionReason && (
                          <button
                            type="button"
                            onClick={() =>
                              openReasonModal(
                                rejectionReason,
                                appointment.reschedule_rejection_reason?.trim()
                                  ? "Reschedule rejection reason"
                                  : "Appointment rejection reason"
                              )
                            }
                            className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            <MessageSquareText className="h-3.5 w-3.5" />
                            View rejection reason
                          </button>
                        )}

                        {(canReschedule(appointment) ||
                          canCancel(appointment) ||
                          canHide(appointment)) && (
                            <div
                              className={`mt-4 grid gap-2 border-t border-slate-100 pt-4 ${[
                                  canReschedule(appointment),
                                  canCancel(appointment),
                                  canHide(appointment),
                                ].filter(Boolean).length === 1
                                  ? "grid-cols-1"
                                  : [
                                    canReschedule(appointment),
                                    canCancel(appointment),
                                    canHide(appointment),
                                  ].filter(Boolean).length === 2
                                    ? "grid-cols-2"
                                    : "grid-cols-1 sm:grid-cols-3"
                                }`}
                            >
                              {canReschedule(appointment) && (
                                <button
                                  onClick={() => openRescheduleModal(appointment)}
                                  disabled={rescheduling === appointment.id}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EAF7FB] px-2 py-2 text-[11px] font-semibold text-[#075C70] transition hover:bg-[#D9F0F6] disabled:opacity-50"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  Reschedule
                                </button>
                              )}

                              {canCancel(appointment) && (
                                <button
                                  onClick={() => openCancelModal(appointment)}
                                  disabled={cancelling === appointment.id}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 px-2 py-2 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Cancel
                                </button>
                              )}

                              {canHide(appointment) && (
                                <button
                                  onClick={() => void hideAppointment(appointment)}
                                  disabled={hiding === appointment.id}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                  {hiding === appointment.id ? (
                                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <EyeOff className="h-3.5 w-3.5" />
                                  )}
                                  Hide
                                </button>
                              )}
                            </div>
                          )}
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-[#FBFDFE] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-400">
                Showing {filteredAppointments.length} of {appointments.length}{" "}
                appointments
              </p>
              <button
                onClick={() => void fetchAppointments()}
                className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[#0E7490] transition hover:text-[#075C70] sm:self-auto"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh appointments
              </button>
            </div>
          </div>
        </section>

        {/* Rejection reason modal */}
        {showReasonModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowReasonModal(false);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="rejection-reason-title"
              className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                  </div>

                  <div>
                    <h2
                      id="rejection-reason-title"
                      className="text-lg font-bold text-slate-900"
                    >
                      {reasonTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Details provided by the doctor
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReasonModal(false)}
                  aria-label="Close rejection reason"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 whitespace-pre-wrap break-words rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-sm leading-6 text-slate-700">
                {selectedReason}
              </div>

              <button
                type="button"
                onClick={() => setShowReasonModal(false)}
                className="mt-5 w-full rounded-xl bg-[#075C70] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#064957] focus:outline-none focus:ring-4 focus:ring-cyan-100"
              >
                Close
              </button>
            </section>
          </div>
        )}

        {/* Cancel confirmation modal */}
        {showCancelModal && selectedAppointment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeCancelModal();
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-title"
              className="animate-[modalIn_.22s_ease-out_both] my-auto w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-white px-5 pb-5 pt-6 sm:px-7">
                <button
                  onClick={closeCancelModal}
                  disabled={cancelling !== null}
                  aria-label="Close cancellation dialog"
                  className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-white shadow-sm">
                  <AlertCircle className="h-6 w-6 text-rose-500" />
                </div>
                <h2
                  id="cancel-title"
                  className="text-xl font-bold tracking-tight text-slate-900"
                >
                  Cancel appointment?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Please confirm that you want to cancel this scheduled visit.
                </p>
              </div>

              <div className="space-y-4 px-5 pb-6 sm:px-7">
                <div className="rounded-2xl border border-slate-100 bg-[#F8FBFC] p-4">
                  <p className="font-semibold text-slate-800">
                    Dr. {selectedAppointment.doctor?.user?.name || "Unknown"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-[#0E7490]" />
                      {formatDate(selectedAppointment.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-[#0E7490]" />
                      {formatTime(selectedAppointment.time)}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cancel-reason"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Reason for cancellation{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="cancel-reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Let us know why you're cancelling..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-50"
                  />
                </div>

                {actionError && (
                  <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                    {actionError}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    onClick={closeCancelModal}
                    disabled={cancelling !== null}
                    className="order-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:order-1"
                  >
                    Keep appointment
                  </button>
                  <button
                    onClick={() => void confirmCancel()}
                    disabled={cancelling === selectedAppointment.id}
                    className="order-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:opacity-60 sm:order-2"
                  >
                    {cancelling === selectedAppointment.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {cancelling === selectedAppointment.id
                      ? "Cancelling..."
                      : "Confirm cancellation"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule modal */}
        {showRescheduleModal && selectedAppointment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeRescheduleModal();
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="reschedule-title"
              className="animate-[modalIn_.22s_ease-out_both] my-auto w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-[#EAF7FB] to-white px-5 pb-5 pt-6 sm:px-7">
                <button
                  onClick={closeRescheduleModal}
                  disabled={rescheduling !== null}
                  aria-label="Close rescheduling dialog"
                  className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-white shadow-sm">
                  <RefreshCw className="h-6 w-6 text-[#0E7490]" />
                </div>
                <h2
                  id="reschedule-title"
                  className="text-xl font-bold tracking-tight text-slate-900"
                >
                  Find a new time
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose a new date and one of the available appointment slots.
                </p>
              </div>

              <div className="space-y-5 px-5 pb-6 sm:px-7">
                <div className="rounded-2xl border border-[#DCEEF3] bg-[#F8FCFD] p-4">
                  <p className="font-semibold text-slate-800">
                    Dr. {selectedAppointment.doctor?.user?.name || "Unknown"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Current appointment: {formatDate(selectedAppointment.date)}{" "}
                    · {formatTime(selectedAppointment.time)}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="reschedule-date"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Choose a date
                  </label>
                  <input
                    id="reschedule-date"
                    type="date"
                    value={newDate}
                    min={getLocalDate()}
                    onChange={(e) => {
                      const date = e.target.value;
                      setNewDate(date);
                      setNewTime("");
                      setAvailableSlots([]);
                      if (date) void fetchAvailableSlots(date);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-50"
                  />
                </div>

                {newDate && (
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-slate-700">
                        Available times
                      </label>
                      {!fetchingSlots && availableSlots.length > 0 && (
                        <span className="text-xs text-slate-400">
                          {availableSlots.length} slots
                        </span>
                      )}
                    </div>

                    {fetchingSlots ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBE5EC] bg-[#F8FCFD] px-4 py-7">
                        <LoaderCircle className="h-6 w-6 animate-spin text-[#0E7490]" />
                        <p className="mt-2 text-sm text-slate-500">
                          Checking available times...
                        </p>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setNewTime(slot)}
                            className={`rounded-xl border px-2 py-3 text-sm font-semibold transition duration-200 ${newTime === slot
                                ? "border-[#075C70] bg-[#075C70] text-white shadow-md shadow-cyan-900/10"
                                : "border-[#DCEEF3] bg-white text-slate-600 hover:border-[#0E7490] hover:bg-[#F0FAFC] hover:text-[#075C70]"
                              }`}
                          >
                            {newTime === slot && (
                              <Check className="mr-1 inline h-3.5 w-3.5" />
                            )}
                            {formatTime(slot)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                        <Clock3 className="mx-auto h-6 w-6 text-slate-300" />
                        <p className="mt-2 text-sm font-medium text-slate-600">
                          No available slots
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Try another date to find an available time.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {actionError && (
                  <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                    {actionError}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <button
                    onClick={closeRescheduleModal}
                    disabled={rescheduling !== null}
                    className="order-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:order-1"
                  >
                    Go back
                  </button>
                  <button
                    onClick={() => void confirmReschedule()}
                    disabled={
                      rescheduling === selectedAppointment.id ||
                      !newDate ||
                      !newTime ||
                      fetchingSlots
                    }
                    className="order-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#075C70] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#064957] focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
                  >
                    {rescheduling === selectedAppointment.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <CalendarCheck className="h-4 w-4" />
                    )}
                    {rescheduling === selectedAppointment.id
                      ? "Rescheduling..."
                      : "Confirm new time"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(*) {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
