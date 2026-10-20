"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CalendarCheck,
  RefreshCw,
  Wallet,
  BriefcaseMedical,
  Info,
} from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  consultation_fee: number;
}

interface Slot {
  time: string;
  available: boolean;
}

function getLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch doctor details
  useEffect(() => {
    let cancelled = false;

    async function fetchDoctorDetails() {
      setLoadingDoctor(true);
      setError("");

      if (!doctorId || !/^\d+$/.test(doctorId) || Number(doctorId) <= 0) {
        setDoctor(null);
        setError("Please select a valid doctor before booking.");
        setLoadingDoctor(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch(
          `http://TechTalks-SmartCare.test/api/doctors/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This doctor could not be found."
              : "Failed to fetch doctor details."
          );
        }

        const data = await response.json();
        const doctorData = data.data || data;

        if (!cancelled) {
          setDoctor({
            id: doctorData.id,
            name: doctorData.name || doctorData.user?.name || "Unknown",
            specialty: doctorData.specialization?.name || "General",
            experience: Number(doctorData.experience_years) || 0,
            consultation_fee: Number(doctorData.consultation_fee) || 0,
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load doctor details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDoctor(false);
        }
      }
    }

    void fetchDoctorDetails();

    return () => {
      cancelled = true;
    };
  }, [doctorId, router]);

  // Fetch available time slots for the selected date
  const fetchAvailableSlots = useCallback(async () => {
    if (!doctorId || !date) return;

    setFetchingSlots(true);
    setError("");
    setSelectedTime(null);
    setSlots([]);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const url =
        `http://TechTalks-SmartCare.test/api/doctors/${doctorId}/available-slots` +
        `?date=${encodeURIComponent(date)}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Could not load available time slots."
        );
      }

      const data = await response.json();

      const allSlots: string[] = Array.isArray(data.all_slots)
        ? data.all_slots
        : [];

      const availableSlots: string[] = Array.isArray(data.available_slots)
        ? data.available_slots
        : [];

      setSlots(
        allSlots.map((time) => ({
          time,
          available: availableSlots.includes(time),
        }))
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load available time slots."
      );
    } finally {
      setFetchingSlots(false);
    }
  }, [doctorId, date, router]);

  useEffect(() => {
    if (doctorId && date && doctor) {
      void fetchAvailableSlots();
    }
  }, [doctorId, date, doctor, fetchAvailableSlots]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedTime(null);
    setSlots([]);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!doctorId || !doctor) {
      setError("Please select a valid doctor.");
      return;
    }

    if (!date || date < getLocalDate()) {
      setError("Please choose today or a future date.");
      return;
    }

    if (!selectedTime) {
      setError("Please select an available time slot.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.replace("/login");
        return;
      }

      const user = JSON.parse(userData);

      if (!user?.id) {
        throw new Error("Your account could not be verified. Please log in again.");
      }

      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            doctor_id: Number(doctorId),
            patient_id: user.id,
            specialization: doctor.specialty,
            date,
            time: selectedTime,
            notes: "",
          }),
        }
      );

      const responseText = await response.text();

      let data: { message?: string } = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          "The server returned an invalid response. Please try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Unable to book your appointment (${response.status}).`
        );
      }

      setSuccess("Your appointment has been booked successfully!");
      setSelectedTime(null);
      setSlots([]);

      window.setTimeout(() => {
        router.push("/patient/dashboard/appointments");
      }, 1800);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to book the appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const availableCount = slots.filter((slot) => slot.available).length;

  if (loadingDoctor) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[#0E8498]" />
          <p className="text-sm font-medium text-slate-500">
            Loading doctor details...
          </p>
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7FA] text-[#075C70]">
            <AlertCircle size={27} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load doctor
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "Please select a doctor and try again."}
          </p>

          <button
            type="button"
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
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
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

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Booking successful!</p>
              <p className="mt-1">{success}</p>
              <p className="mt-1 text-xs">
                Taking you to your appointments...
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <XCircle size={20} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Something needs your attention</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError("")}
              className="rounded-lg p-1 transition hover:bg-red-100"
            >
              <XCircle size={16} />
            </button>
          </div>
        )}

        {/* Doctor summary */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#D8EBF0] bg-white shadow-[0_8px_30px_rgba(7,92,112,0.05)]">
          <div className="h-1.5 bg-gradient-to-r from-[#075C70] via-[#0E8498] to-cyan-200" />

          <div className="p-5 sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#075C70] to-[#0E8498] text-white shadow-md shadow-[#075C70]/15 sm:h-[76px] sm:w-[76px] sm:rounded-3xl">
                <Stethoscope size={32} strokeWidth={1.6} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0E8498]">
                  Selected doctor
                </p>
                <h2 className="mt-1 break-words text-xl font-bold text-slate-900 sm:text-2xl">
                  {doctor.name}
                </h2>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#D8EBF0] bg-[#F0FAFC] px-3 py-1 text-xs font-semibold text-[#075C70]">
                  <User size={13} />
                  {doctor.specialty}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F7FAFB] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0E8498] shadow-sm">
                  <BriefcaseMedical size={19} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Experience</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {doctor.experience}{" "}
                    {doctor.experience === 1 ? "year" : "years"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F7FAFB] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0E8498] shadow-sm">
                  <Wallet size={19} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Consultation fee</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    ${doctor.consultation_fee}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F7FAFB] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0E8498] shadow-sm">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Booking</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Appointment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appointment form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
        >
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-slate-900">
              Choose your appointment
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Select a date to see available appointment times.
            </p>
          </div>

          <div className="p-5 sm:p-7">
            {/* Date selection */}
            <div>
              <label
                htmlFor="appointment-date"
                className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-800"
              >
                <Calendar size={17} className="text-[#0E8498]" />
                Appointment date
                <span className="text-red-500">*</span>
              </label>

              <input
                id="appointment-date"
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={getLocalDate()}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0E8498] focus:bg-white focus:ring-4 focus:ring-[#0E8498]/10 sm:max-w-sm"
              />
            </div>

            {/* Time slots */}
            {date && (
              <div className="mt-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                      <Clock size={18} className="text-[#0E8498]" />
                      Available time slots
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {fetchingSlots
                        ? "Checking available times..."
                        : `${availableCount} ${availableCount === 1 ? "slot" : "slots"
                        } available`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void fetchAvailableSlots()}
                    disabled={fetchingSlots || loading}
                    className="inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#075C70] transition hover:bg-[#F0FAFC] disabled:opacity-50"
                  >
                    <RefreshCw
                      size={15}
                      className={fetchingSlots ? "animate-spin" : ""}
                    />
                    Refresh times
                  </button>
                </div>

                {fetchingSlots ? (
                  <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/60">
                    <Loader2 className="h-7 w-7 animate-spin text-[#0E8498]" />
                    <p className="mt-3 text-sm text-slate-500">
                      Loading available times...
                    </p>
                  </div>
                ) : slots.length > 0 ? (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {slots.map((slot) => {
                      const isSelected = selectedTime === slot.time;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available || loading}
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedTime(slot.time);
                            setError("");
                            setSuccess("");
                          }}
                          className={`relative flex min-h-[76px] flex-col items-center justify-center rounded-2xl border px-3 py-3 text-center transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#0E8498]/15 ${!slot.available
                              ? "cursor-not-allowed border-slate-100 bg-slate-100/80 text-slate-400"
                              : isSelected
                                ? "border-[#075C70] bg-[#075C70] text-white shadow-md shadow-[#075C70]/15"
                                : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#0E8498] hover:bg-[#F0FAFC]"
                            }`}
                        >
                          <span className="text-sm font-bold">
                            {slot.time}
                          </span>
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
                            <CheckCircle
                              size={15}
                              className="absolute right-2 top-2"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-9 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                      <Calendar size={23} />
                    </div>
                    <h4 className="mt-4 font-semibold text-slate-800">
                      No time slots available
                    </h4>
                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                      There are no available times for this date. Try selecting another date.
                    </p>
                  </div>
                )}

                {selectedTime && !fetchingSlots && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#D8EBF0] bg-[#F0FAFC] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0E8498] shadow-sm">
                      <CalendarCheck size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#0E7490]">
                        Your selection
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-slate-900">
                        {date} at {selectedTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!date && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                <Info size={17} className="mt-0.5 shrink-0 text-[#0E8498]" />
                Choose an appointment date to view the available time slots.
              </div>
            )}

            {/* Submit */}
            <div className="mt-7 border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={loading || fetchingSlots || !selectedTime || !date}
                className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#075C70] to-[#0E8498] px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(7,92,112,0.15)] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#0E8498]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none sm:w-auto sm:min-w-64"
              >
                {loading ? (
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
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-[#0E8498]"
                />
                Your appointment is confirmed only after the server successfully processes your booking.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
