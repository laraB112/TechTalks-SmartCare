
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CalendarCheck,
  RefreshCw,
  Info,
  X,
  BriefcaseMedical,
} from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  experience: number;
};

type Slot = {
  time: string;
  available: boolean;
};

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();

  const rawDoctorId = params.doctorId;
  const doctorId = Number(
    Array.isArray(rawDoctorId) ? rawDoctorId[0] : rawDoctorId
  );

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDoctor = useCallback(
    async (preserveSuccess = false) => {
      if (!Number.isInteger(doctorId) || doctorId <= 0) {
        setDoctor(null);
        setSlots([]);
        setError("The requested doctor could not be identified.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      if (!preserveSuccess) {
        setSuccess("");
      }

      try {
        const [doctorRes, slotRes] = await Promise.all([
          fetch(`http://localhost:8000/api/doctors/${doctorId}`, {
            headers: { Accept: "application/json" },
          }),
          fetch(
            `http://localhost:8000/api/doctors/${doctorId}/slots?date=${selectedDate}`,
            {
              headers: { Accept: "application/json" },
            }
          ),
        ]);

        if (!doctorRes.ok) {
          throw new Error(
            doctorRes.status === 404
              ? "This doctor could not be found."
              : "Unable to load the doctor details."
          );
        }

        if (!slotRes.ok) {
          throw new Error("Unable to load available appointment times.");
        }

        const doctorData = await doctorRes.json();
        const slotData = await slotRes.json();

        setDoctor(doctorData);
        setSlots(Array.isArray(slotData) ? slotData : []);
      } catch (err: unknown) {
        console.error("Error loading appointment details:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the appointment page."
        );
      } finally {
        setLoading(false);
      }
    },
    [doctorId, selectedDate]
  );

  useEffect(() => {
    void loadDoctor();
  }, [loadDoctor]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot("");
    setSuccess("");
    setError("");
  };

  async function handleBook() {
    if (!selectedSlot) {
      setError("Please select an available time slot first.");
      return;
    }

    if (!selectedDate || selectedDate < getLocalDate()) {
      setError("Please choose today or a future date.");
      return;
    }

    setBooking(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.id) {
        throw new Error(
          "Your account details could not be verified. Please log in again."
        );
      }

      const response = await fetch(
        "http://localhost:8000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctor_id: doctorId,
            patient_id: user.id,
            date: selectedDate,
            time: selectedSlot,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to book this appointment. Please try again."
        );
      }

      setSuccess("Your appointment has been booked successfully!");
      setSelectedSlot("");

      await loadDoctor(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBooking(false);
    }
  }

  if (loading && !doctor) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-3 sm:min-h-[70vh] sm:px-4">
        <div className="flex flex-col items-center gap-2.5">
          <Loader2 className="h-7 w-7 animate-spin text-[#0E8498] sm:h-9 sm:w-9" />
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            Loading appointment details...
          </p>
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-3 sm:min-h-[70vh] sm:px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:rounded-3xl sm:p-7">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 sm:h-14 sm:w-14 sm:rounded-2xl">
            <AlertCircle size={23} />
          </div>
          <h1 className="mt-3 text-lg font-bold text-slate-900 sm:mt-4 sm:text-xl">
            Doctor unavailable
          </h1>
          <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
            {error || "We couldn't find the requested doctor."}
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#075C70] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#064B5B] sm:mt-6 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
          >
            <ArrowLeft size={15} />
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6FAFB] px-3 py-4 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-1.5 py-1 text-xs font-medium text-slate-500 transition hover:text-[#075C70] sm:mb-4 sm:gap-2 sm:text-sm"
          >
            <ArrowLeft size={15} />
            Back to doctors
          </button>

          <div className="flex items-center gap-2.5 sm:items-start sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FA] text-[#075C70] sm:h-12 sm:w-12 sm:rounded-2xl">
              <CalendarCheck size={21} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Book an appointment
              </h1>
              <p className="mt-0.5 text-xs leading-4 text-slate-500 sm:mt-1 sm:text-base sm:leading-6">
                Choose a convenient date and time for your visit.
              </p>
            </div>
          </div>
        </div>

        {/* Doctor information */}
        <section className="mb-4 overflow-hidden rounded-2xl border border-[#D8EBF0] bg-white shadow-[0_4px_18px_rgba(7,92,112,0.05)] sm:mb-5 sm:rounded-3xl">
          <div className="h-1 bg-gradient-to-r from-[#075C70] via-[#0E8498] to-cyan-200 sm:h-1.5" />

          <div className="p-3.5 sm:p-6">
            {/* Doctor name */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#075C70] text-white sm:h-14 sm:w-14 sm:rounded-2xl">
                <Stethoscope size={24} strokeWidth={1.6} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0E8498] sm:text-xs sm:tracking-[0.14em]">
                  Selected doctor
                </p>
                <h2 className="mt-0.5 break-words text-base font-bold leading-5 text-slate-900 sm:mt-1 sm:text-xl">
                  {doctor.name}
                </h2>
              </div>

              <div className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-[#F5FAFB] px-3 py-2 text-xs font-medium text-slate-600 sm:flex">
                <ShieldCheck size={16} className="text-[#0E8498]" />
                Secure booking
              </div>
            </div>

            {/* Stat-style information cards */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
              <div className="min-w-0 rounded-xl border border-[#E1EEF1] bg-[#F7FBFC] p-3 sm:rounded-2xl sm:p-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E3F3F6] text-[#075C70] sm:h-9 sm:w-9 sm:rounded-xl">
                  <User size={15} className="sm:h-[18px] sm:w-[18px]" />
                </div>
                <p className="mt-2 text-[10px] font-medium text-slate-500 sm:mt-3 sm:text-xs">
                  Specialty
                </p>
                <p className="mt-0.5 break-words text-xs font-bold leading-5 text-slate-800 sm:text-sm">
                  {doctor.specialty || "Not specified"}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-[#E1EEF1] bg-[#F7FBFC] p-3 sm:rounded-2xl sm:p-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E3F3F6] text-[#075C70] sm:h-9 sm:w-9 sm:rounded-xl">
                  <BriefcaseMedical
                    size={15}
                    className="sm:h-[18px] sm:w-[18px]"
                  />
                </div>
                <p className="mt-2 text-[10px] font-medium text-slate-500 sm:mt-3 sm:text-xs">
                  Experience
                </p>
                <p className="mt-0.5 break-words text-xs font-bold leading-5 text-slate-800 sm:text-sm">
                  {doctor.experience > 0
                    ? `${doctor.experience} years`
                    : "Not specified"}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-[#E1EEF1] bg-[#F7FBFC] p-3 sm:rounded-2xl sm:p-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E3F3F6] text-[#075C70] sm:h-9 sm:w-9 sm:rounded-xl">
                  <ShieldCheck
                    size={15}
                    className="sm:h-[18px] sm:w-[18px]"
                  />
                </div>
                <p className="mt-2 text-[10px] font-medium text-slate-500 sm:mt-3 sm:text-xs">
                  Booking
                </p>
                <p className="mt-0.5 break-words text-xs font-bold leading-5 text-slate-800 sm:text-sm">
                  Secure appointment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback messages */}
        {success && (
          <div
            role="status"
            className="mb-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 sm:mb-5 sm:gap-3 sm:rounded-2xl sm:p-4 sm:text-sm"
          >
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 sm:h-5 sm:w-5" />
            <div className="min-w-0">
              <p className="font-semibold">Booking successful</p>
              <p className="mt-0.5 leading-5">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:mb-5 sm:gap-3 sm:rounded-2xl sm:p-4 sm:text-sm"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0 sm:h-5 sm:w-5" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Unable to continue</p>
              <p className="mt-0.5 break-words leading-5">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 rounded-md p-1 transition hover:bg-red-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Booking section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)] sm:rounded-3xl">
          <div className="border-b border-slate-100 px-3.5 py-3.5 sm:px-6 sm:py-5">
            <h2 className="text-sm font-bold text-slate-900 sm:text-lg">
              Choose your appointment
            </h2>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-500 sm:mt-1 sm:text-sm sm:leading-6">
              Select a date, then choose an available time.
            </p>
          </div>

          <div className="p-3.5 sm:p-6">
            {/* Date selection */}
            <div>
              <label
                htmlFor="appointment-date"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-800 sm:mb-2.5 sm:gap-2 sm:text-sm"
              >
                <Calendar size={15} className="text-[#0E8498] sm:h-[17px] sm:w-[17px]" />
                Appointment date
              </label>

              <input
                id="appointment-date"
                type="date"
                min={getLocalDate()}
                value={selectedDate}
                onChange={(event) => handleDateChange(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0E8498] focus:bg-white focus:ring-2 focus:ring-[#0E8498]/10 sm:max-w-sm sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              />
            </div>

            {/* Available times */}
            <div className="mt-5 flex items-center justify-between gap-2 sm:mt-8">
              <div className="min-w-0">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 sm:gap-2 sm:text-base">
                  <Clock size={16} className="shrink-0 text-[#0E8498] sm:h-[18px] sm:w-[18px]" />
                  Available times
                </h3>
                <p className="mt-0.5 text-[10px] text-slate-500 sm:mt-1 sm:text-sm">
                  {slots.filter((slot) => slot.available).length} available
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadDoctor()}
                disabled={loading || booking}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-[#075C70] transition hover:bg-[#F0FAFC] disabled:opacity-50 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
              >
                <RefreshCw
                  size={12}
                  className={
                    loading
                      ? "animate-spin sm:h-[15px] sm:w-[15px]"
                      : "sm:h-[15px] sm:w-[15px]"
                  }
                />
                Refresh
              </button>
            </div>

            {/* Time slots */}
            {loading ? (
              <div className="mt-3 flex min-h-28 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/60 sm:mt-5 sm:min-h-36 sm:rounded-2xl">
                <Loader2 className="h-6 w-6 animate-spin text-[#0E8498] sm:h-7 sm:w-7" />
                <p className="mt-2 text-xs text-slate-500 sm:mt-3 sm:text-sm">
                  Checking available times...
                </p>
              </div>
            ) : slots.length === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-6 text-center sm:mt-5 sm:rounded-2xl sm:px-5 sm:py-10">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Calendar size={19} />
                </div>
                <h4 className="mt-2.5 text-sm font-semibold text-slate-800 sm:mt-4">
                  No time slots available
                </h4>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                  Try selecting another date to find an available appointment.
                </p>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot.time;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available || booking}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedSlot(slot.time);
                        setError("");
                        setSuccess("");
                      }}
                      className={`relative flex min-h-[56px] min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition focus:outline-none focus:ring-2 focus:ring-[#0E8498]/20 sm:min-h-[76px] sm:rounded-2xl sm:px-3 sm:py-3 ${
                        !slot.available
                          ? "cursor-not-allowed border-slate-100 bg-slate-100/80 text-slate-400"
                          : isSelected
                            ? "border-[#075C70] bg-[#075C70] text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-[#0E8498] hover:bg-[#F0FAFC]"
                      }`}
                    >
                      <span className="text-xs font-bold sm:text-sm">
                        {slot.time}
                      </span>
                      <span
                        className={`mt-0.5 text-[9px] font-medium sm:mt-1 sm:text-[11px] ${
                          !slot.available
                            ? "text-slate-400"
                            : isSelected
                              ? "text-cyan-100"
                              : "text-emerald-600"
                        }`}
                      >
                        {!slot.available
                          ? "Booked"
                          : isSelected
                            ? "Selected"
                            : "Available"}
                      </span>

                      {isSelected && (
                        <CheckCircle2
                          size={13}
                          className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 sm:h-[15px] sm:w-[15px]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected appointment summary */}
            {selectedSlot && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#D8EBF0] bg-[#F0FAFC] p-3 sm:mt-5 sm:gap-3 sm:rounded-2xl sm:p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0E8498] shadow-sm sm:h-10 sm:w-10 sm:rounded-xl">
                  <CalendarCheck size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#0E7490] sm:text-xs">
                    Your selection
                  </p>
                  <p className="mt-0.5 break-words text-xs font-bold text-slate-900 sm:mt-1 sm:text-sm">
                    {selectedDate} at {selectedSlot}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:mt-1 sm:text-xs">
                    Check the selected date and time before confirming.
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation */}
            <div className="mt-5 border-t border-slate-100 pt-4 sm:mt-7 sm:pt-5">
              <button
                type="button"
                onClick={handleBook}
                disabled={!selectedSlot || booking || loading}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#075C70] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#064B5B] focus:outline-none focus:ring-2 focus:ring-[#0E8498]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 sm:w-auto sm:min-w-64 sm:gap-2.5 sm:rounded-xl sm:px-5 sm:py-3.5 sm:text-sm"
              >
                {booking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Booking appointment...
                  </>
                ) : (
                  <>
                    <CalendarCheck size={16} />
                    Confirm appointment
                  </>
                )}
              </button>

              <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-4 text-slate-500 sm:mt-3 sm:gap-2 sm:text-xs sm:leading-5">
                <Info size={13} className="mt-0.5 shrink-0 text-[#0E8498] sm:h-[15px] sm:w-[15px]" />
                Your appointment is confirmed only after the booking request succeeds.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
