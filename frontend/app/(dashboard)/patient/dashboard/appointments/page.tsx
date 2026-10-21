
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Hourglass,
  Search,
  RefreshCw,
  LoaderCircle,
  Stethoscope,
  CalendarCheck,
  AlertCircle,
  X,
} from "lucide-react";

// -------------------- Types and constants --------------------

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  queue_position?: number;
  doctor: {
    id: number;
    user: {
      name: string;
    };
  };
}

const API_URL = "http://TechTalks-SmartCare.test/api";

const ACTIVE_STATUSES = ["pending", "accepted", "in_progress"];
const CLOSED_STATUSES = ["completed", "cancelled", "rejected"];

type Filter = "all" | "upcoming" | "completed" | "cancelled";

// -------------------- Helper functions --------------------

function localDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";

  const date = new Date(`${value.split("T")[0]}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return "Time unavailable";

  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = match[2];

  if (hours > 23) return value;

  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
}

function statusKey(status: string) {
  return status.toLowerCase().replace(/[\s-]+/g, "_");
}

function isUpcoming(appointment: Appointment) {
  return (
    appointment.date.split("T")[0] >= localDate() &&
    !CLOSED_STATUSES.includes(statusKey(appointment.status))
  );
}

function statusStyle(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-cyan-50 text-cyan-800 border-cyan-200",
    in_progress: "bg-violet-50 text-violet-700 border-violet-200",
    completed: "bg-teal-50 text-teal-800 border-teal-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    styles[statusKey(status)] ||
    "bg-slate-100 text-slate-600 border-slate-200"
  );
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pending",
    accepted: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return labels[statusKey(status)] || status;
}

function getToken() {
  return localStorage.getItem("token");
}

// -------------------- Main page --------------------

export default function AppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [modal, setModal] = useState<"cancel" | "reschedule" | null>(null);

  const [cancelReason, setCancelReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [actionError, setActionError] = useState("");

  // Load the patient's appointments.
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const token = getToken();

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
        throw new Error("Unable to load appointments.");
      }

      const data = await response.json();

      setAppointments(
        Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : []
      );
    } catch (error) {
      console.error(error);
      setPageError("We couldn't load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  // Calculate the summary and filtered list.
  const upcoming = useMemo(
    () =>
      appointments
        .filter(isUpcoming)
        .sort(
          (a, b) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
        ),
    [appointments]
  );

  const nextAppointment = upcoming[0];

  const completedCount = appointments.filter(
    (item) => statusKey(item.status) === "completed"
  ).length;

  const activeCount = appointments.filter((item) =>
    ACTIVE_STATUSES.includes(statusKey(item.status))
  ).length;

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((item) => {
        const name = item.doctor?.user?.name || "";
        const status = statusKey(item.status);

        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
          filter === "all" ||
          (filter === "upcoming" && isUpcoming(item)) ||
          (filter === "completed" && status === "completed") ||
          (filter === "cancelled" &&
            ["cancelled", "rejected"].includes(status));

        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
      );
  }, [appointments, search, filter]);

  // Only active appointments scheduled today or later can be changed.
  function canManage(item: Appointment) {
    const status = statusKey(item.status);

    return ["pending", "accepted", "confirmed"].includes(status);
  }

  // Open a modal and reset its previous values.
  function openModal(type: "cancel" | "reschedule", item: Appointment) {
    setSelected(item);
    setModal(type);
    setActionError("");
    setCancelReason("");
    setNewDate("");
    setNewTime("");
    setSlots([]);
  }

  function closeModal() {
    if (saving) return;

    setModal(null);
    setSelected(null);
    setActionError("");
    setSlots([]);
  }

  // Cancel an appointment.
  async function cancelAppointment() {
    if (!selected) return;

    setSaving(true);
    setActionError("");

    try {
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/patient/appointments/${selected.id}/cancel`,
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
        throw new Error(data.message || "Unable to cancel this appointment.");
      }

      setAppointments((current) =>
        current.map((item) =>
          item.id === selected.id ? { ...item, status: "cancelled" } : item
        )
      );

      closeModal();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  // Load available slots when the patient selects a date.
  async function loadSlots(date: string) {
    setNewDate(date);
    setNewTime("");
    setSlots([]);
    setActionError("");

    if (!selected || !date) return;

    setLoadingSlots(true);

    try {
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/doctors/${selected.doctor.id}/available-slots?date=${encodeURIComponent(date)}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load available slots.");
      }

      setSlots(
        Array.isArray(data.available_slots) ? data.available_slots : []
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to load time slots."
      );
    } finally {
      setLoadingSlots(false);
    }
  }

  // Save the new appointment date and time.
  async function rescheduleAppointment() {
    if (!selected || !newDate || !newTime) return;

    setSaving(true);
    setActionError("");

    try {
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/appointments/${selected.id}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date: newDate, time: newTime }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reschedule appointment.");
      }

      setAppointments((current) =>
        current.map((item) =>
          item.id === selected.id
            ? { ...item, date: newDate, time: newTime, status: "pending" }
            : item
        )
      );

      closeModal();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  // -------------------- Loading and error states --------------------

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-[#075C70]">
        <LoaderCircle className="h-9 w-9 animate-spin" />
        <p className="text-sm font-medium">Loading your appointments...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto mb-3 h-9 w-9 text-rose-500" />
        <h2 className="text-lg font-semibold text-slate-800">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-slate-500">{pageError}</p>
        <button
          onClick={() => void loadAppointments()}
          className="mt-5 rounded-xl bg-[#075C70] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#064B5B]"
        >
          Try again
        </button>
      </div>
    );
  }

  // -------------------- Page UI --------------------

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-[#0E7490]">Patient dashboard</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Appointments
        </h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Total appointments"
          value={appointments.length}
          color="blue"
        />
        <SummaryCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Active appointments"
          value={activeCount}
          color="amber"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Completed"
          value={completedCount}
          color="green"
        />
      </div>

      {/* Next appointment */}
      {nextAppointment && (
        <section className="overflow-hidden rounded-2xl border border-[#D7EDF1] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5F1F3] bg-[#F0FAFC] px-5 py-4">
            <div className="flex items-center gap-2 text-[#075C70]">
              <CalendarCheck className="h-5 w-5" />
              <h2 className="font-semibold">Your next appointment</h2>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(
                nextAppointment.status
              )}`}
            >
              {statusLabel(nextAppointment.status)}
            </span>
          </div>

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E5F5F8] text-[#075C70]">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Dr. {nextAppointment.doctor?.user?.name || "Doctor"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(nextAppointment.date)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatTime(nextAppointment.time)}
                </p>
              </div>
            </div>

            {canManage(nextAppointment) && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openModal("reschedule", nextAppointment)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#B9DDE4] px-4 py-2.5 text-sm font-semibold text-[#075C70] hover:bg-[#F0FAFC]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reschedule
                </button>
                <button
                  onClick={() => openModal("cancel", nextAppointment)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Search and filters */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by doctor name..."
              className="w-full text-black rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/10"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as Filter)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#0E7490]"
          >
            <option value="all">All appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled / rejected</option>
          </select>
        </div>

        {/* Appointment list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Appointment history</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7FB] text-[#075C70]">
                <CalendarDays className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                {appointments.length === 0
                  ? "No appointments yet"
                  : "No matching appointments"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                {appointments.length === 0
                  ? "Your booked appointments will appear here."
                  : "Try changing your search or selecting a different filter."}
              </p>
              {appointments.length === 0 && (
                <button
                  onClick={() => router.push("/patient/dashboard")}
                  className="mt-5 rounded-xl bg-[#075C70] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#064B5B]"
                >
                  Find a doctor
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Doctor</th>
                      <th className="px-5 py-4 font-semibold">Date</th>
                      <th className="px-5 py-4 font-semibold">Time</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#075C70]">
                              <Stethoscope className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-slate-800">
                              Dr. {item.doctor?.user?.name || "Doctor"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatTime(item.time)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(
                              item.status
                            )}`}
                          >
                            {statusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {canManage(item) ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openModal("reschedule", item)}
                                title="Reschedule appointment"
                                className="rounded-lg p-2 text-[#075C70] hover:bg-[#EAF7FB]"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openModal("cancel", item)}
                                title="Cancel appointment"
                                className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-right text-xs text-slate-400">
                              No actions available
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredAppointments.map((item) => (
                  <article key={item.id} className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#075C70]">
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Dr. {item.doctor?.user?.name || "Doctor"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle(
                          item.status
                        )}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock3 className="h-4 w-4 text-slate-400" />
                      {formatTime(item.time)}
                    </div>

                    {canManage(item) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal("reschedule", item)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#B9DDE4] px-3 py-2.5 text-sm font-semibold text-[#075C70] hover:bg-[#F0FAFC]"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Reschedule
                        </button>
                        <button
                          onClick={() => openModal("cancel", item)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Cancel and reschedule modals */}
      {modal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modal === "cancel"
                    ? "Cancel appointment"
                    : "Reschedule appointment"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Dr. {selected.doctor?.user?.name || "Doctor"}
                </p>
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {modal === "cancel" ? (
                <>
                  <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                    <p className="text-sm font-semibold text-rose-800">
                      Are you sure you want to cancel?
                    </p>
                    <p className="mt-1 text-sm text-rose-700">
                      {formatDate(selected.date)} at {formatTime(selected.time)}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Reason (optional)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(event) => setCancelReason(event.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Tell us why you're cancelling..."
                      className="w-full text-black resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/10"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-[#F0FAFC] p-4">
                    <p className="text-sm text-slate-600">Current appointment</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {formatDate(selected.date)} · {formatTime(selected.time)}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      New date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      min={localDate()}
                      onChange={(event) => void loadSlots(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E7490]"
                    />
                  </div>

                  {newDate && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Available time
                      </label>

                      {loadingSlots ? (
                        <div className="flex items-center gap-2 py-3 text-sm text-slate-500">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Loading available times...
                        </div>
                      ) : slots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setNewTime(slot)}
                              className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition ${newTime === slot
                                ? "border-[#075C70] bg-[#075C70] text-white"
                                : "border-slate-200 text-slate-700 hover:border-[#0E7490] hover:bg-[#F0FAFC]"
                                }`}
                            >
                              {formatTime(slot)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                          No available times for this date. Please choose
                          another date.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {actionError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{actionError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep appointment
                </button>

                <button
                  onClick={() =>
                    modal === "cancel"
                      ? void cancelAppointment()
                      : void rescheduleAppointment()
                  }
                  disabled={
                    saving ||
                    (modal === "reschedule" &&
                      (!newDate || !newTime || loadingSlots))
                  }
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${modal === "cancel"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-[#075C70] hover:bg-[#064B5B]"
                    }`}
                >
                  {saving ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : modal === "cancel" ? (
                    "Confirm cancellation"
                  ) : (
                    "Confirm new time"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- Small reusable summary card --------------------

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "amber" | "green";
}) {
  const colors = {
    blue: "bg-[#EAF7FB] text-[#075C70]",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-teal-50 text-teal-700",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
