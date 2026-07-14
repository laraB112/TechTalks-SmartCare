"use client";

import { useState, useEffect } from "react";
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

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch doctor details
  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (doctorId && date) {
      fetchAvailableSlots();
    }
  }, [doctorId, date]);

  const fetchDoctorDetails = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://TechTalks-SmartCare.test/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch doctor details");

      const data = await response.json();
      const doctorData = data.data || data;

      setDoctor({
        id: doctorData.id,
        name: doctorData.name || doctorData.user?.name || "Unknown",
        specialty: doctorData.specialization?.name || "General",
        experience: doctorData.experience_years || 0,
        consultation_fee: doctorData.consultation_fee || 0,
      });
    } catch (err) {
      setError("Could not load doctor details.");
    }
  };

  const fetchAvailableSlots = async () => {
    if (!doctorId || !date) return;

    setFetchingSlots(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const url = `http://TechTalks-SmartCare.test/api/doctors/${doctorId}/available-slots?date=${date}`;
      console.log("🔍 Fetching URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Available slots data:", data);

      const allSlots = data.all_slots || [];
      const availableSlots = data.available_slots || [];

      const mappedSlots = allSlots.map((time: string) => ({
        time,
        available: availableSlots.includes(time),
      }));

      setSlots(mappedSlots);
      setSelectedTime(null);
      setError("");
    } catch (err: any) {
      console.error("❌ Error fetching slots:", err);
      setError(err.message || "Could not load available time slots.");
    } finally {
      setFetchingSlots(false);
    }
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!selectedTime) {
        setError("Please select a time slot.");
        setLoading(false);
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        // ✅ Use the EXACT URL that works in Postman
        const url = "http://TechTalks-SmartCare.test/api/appointments";
        console.log("📤 Booking URL:", url);
        console.log("📤 Booking data:", {
            doctor_id: parseInt(doctorId!),
            patient_id: user?.id,
            date,
            time: selectedTime,
        });

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: JSON.stringify({
                doctor_id: parseInt(doctorId!),
                patient_id: user?.id,
                specialization: doctor?.specialty || "General",
                date,
                time: selectedTime,
                notes: "",
            }),
        });

        console.log("📡 Response status:", response.status);

        // ✅ Get response as text first to debug
        const responseText = await response.text();
        console.log("📄 Raw response:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("❌ Failed to parse JSON:", parseError);
            throw new Error("Server returned invalid response. Please check if backend is running.");
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        setSuccess("Appointment booked successfully!");
        setDate("");
        setSelectedTime(null);
        setSlots([]);

        setTimeout(() => {
            router.push("/patient/dashboard/appointments");
        }, 2000);
    } catch (err: any) {
        console.error("❌ Booking error:", err);
        setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
        setLoading(false);
    }
};
  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (doctorId && !doctor && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Book Appointment
          </h1>
        </div>

        {/* Success / Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 sm:p-4 rounded-xl mb-4 flex items-center gap-2 sm:gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-sm sm:text-base">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-xl mb-4 flex items-center gap-2 sm:gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        {/* Doctor Card */}
        {doctor && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              SELECTED DOCTOR
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                 {doctor.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialty</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {doctor.specialty}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {doctor.experience} years
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  ${doctor.consultation_fee}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="space-y-5">

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Select Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getMinDate()}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                required
              />
            </div>

            {/* Time Slots */}
            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Select Time <span className="text-red-500">*</span>
                </label>

                {fetchingSlots ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading available slots...</span>
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`
                          py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                          ${slot.available
                            ? selectedTime === slot.time
                              ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 shadow-md'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-105'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      No available slots for this date. Please select another date.
                    </p>
                  </div>
                )}

                {selectedTime && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Selected: <span className="font-medium">{selectedTime}</span>
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedTime}
              className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Confirm Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}