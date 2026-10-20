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

  const loadDoctor = useCallback(async () => {
    if (!Number.isInteger(doctorId) || doctorId <= 0) {
      setDoctor(null);
      setSlots([]);
      setError("The requested doctor could not be identified.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

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
  }, [doctorId, selectedDate]);

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
        throw new Error("Your account details could not be verified. Please log in again.");
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

      await loadDoctor();
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
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[#0E8498]" />
          <p className="text-sm font-medium text-slate-500">
            Loading appointment details...
          </p>
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={27} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Doctor unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "We couldn't find the requested doctor."}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#075C70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064B5B]"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6FAFB] px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-7">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#075C70]"
          >
            <ArrowLeft size={17} />
            Back to doctors
          </button>

          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7FA] text-[#075C70]">
              <CalendarCheck size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Book an appointment
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                Choose a convenient date and time for your visit.
              </p>
            </div>
          </div>
        </div>

        {/* Doctor card */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#D8EBF0] bg-white shadow-[0_8px_30px_rgba(7,92,112,0.05)]">
          <div className="h-1.5 bg-gradient-to-r from-[#075C70] via-[#0E8498] to-cyan-200" />

          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#075C70] to-[#0E8498] text-white shadow-lg shadow-[#075C70]/15 sm:h-20 sm:w-20 sm:rounded-3xl">
                <Stethoscope size={34} strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0E8498]">
                  Your selected doctor
                </p>
                <h2 className="mt-1 break-words text-xl font-bold text-slate-900 sm:text-2xl">
                  {doctor.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8EBF0] bg-[#F0FAFC] px-3 py-1 text-xs font-semibold text-[#075C70]">
                    <User size={13} />
                    {doctor.specialty}
                  </span>
                  {doctor.experience > 0 && (
                    <span className="text-xs text-slate-500">
                      {doctor.experience} years of experience
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#F5FAFB] px-4 py-3 text-sm text-slate-600">
              <ShieldCheck size={18} className="shrink-0 text-[#0E8498]" />
              <span>Appointment booking</span>
            </div>
          </div>
        </section>

        {/* Feedback */}
        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Booking successful</p>
              <p className="mt-1">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Unable to continue</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 transition hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Booking form */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-slate-900">
              Choose your appointment
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Select a date first, then choose from the available times.
            </p>
          </div>

          <div className="p-5 sm:p-7">
            {/* Date picker */}
            <div>
              <label
                htmlFor="appointment-date"
                className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-800"
              >
                <Calendar size={17} className="text-[#0E8498]" />
                Appointment date
              </label>

              <input
                id="appointment-date"
                type="date"
                min={getLocalDate()}
                value={selectedDate}
                onChange={(event) => handleDateChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0E8498] focus:bg-white focus:ring-4 focus:ring-[#0E8498]/10 sm:max-w-sm"
              />
            </div>

            {/* Slots heading */}
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <Clock size={18} className="text-[#0E8498]" />
                  Available time slots
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {slots.filter((slot) => slot.available).length} time slots available
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadDoctor()}
                disabled={loading || booking}
                className="inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#075C70] transition hover:bg-[#F0FAFC] disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh times
              </button>
            </div>

            {/* Slots */}
            {loading ? (
              <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/60">
                <Loader2 className="h-7 w-7 animate-spin text-[#0E8498]" />
                <p className="mt-3 text-sm text-slate-500">
                  Checking available times...
                </p>
              </div>
            ) : slots.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <Calendar size={23} />
                </div>
                <h4 className="mt-4 font-semibold text-slate-800">
                  No time slots available
                </h4>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  There are no appointment times listed for this date. Try selecting another date.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
                      className={`group relative flex min-h-[76px] flex-col items-center justify-center rounded-2xl border px-3 py-3 text-center transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#0E8498]/15 ${!slot.available
                          ? "cursor-not-allowed border-slate-100 bg-slate-100/80 text-slate-400"
                          : isSelected
                            ? "border-[#075C70] bg-[#075C70] text-white shadow-md shadow-[#075C70]/15"
                            : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#0E8498] hover:bg-[#F0FAFC]"
                        }`}
                    >
                      <span className="text-sm font-bold">{slot.time}</span>
                      <span
                        className={`mt-1 text-[11px] font-medium ${!slot.available
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
                          size={15}
                          className="absolute right-2 top-2"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selection summary */}
            {selectedSlot && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#D8EBF0] bg-[#F0FAFC] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0E8498] shadow-sm">
                  <CalendarCheck size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0E7490]">
                    Your selection
                  </p>
                  <p className="mt-1 break-words text-sm font-bold text-slate-900">
                    {selectedDate} at {selectedSlot}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Please confirm that the selected date and time are correct.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-7 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleBook}
                disabled={!selectedSlot || booking || loading}
                className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#075C70] to-[#0E8498] px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(7,92,112,0.15)] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#0E8498]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none sm:w-auto sm:min-w-64"
              >
                {booking ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Booking appointment...
                  </>
                ) : (
                  <>
                    <CalendarCheck size={18} />
                    Confirm appointment
                  </>
                )}
              </button>

              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <Info size={15} className="mt-0.5 shrink-0 text-[#0E8498]" />
                Your appointment is not confirmed until the booking request succeeds.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
