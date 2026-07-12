"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
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

export default function BookAppointmentPage() {
  const params = useParams();
  const doctorId = Number(params.doctorId);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, [doctorId, selectedDate]);

  async function loadDoctor() {
    try {
      setLoading(true);

      // Doctor
      const doctorRes = await fetch(
        `http://localhost:8000/api/doctors/${doctorId}`
      );

      const doctorData = await doctorRes.json();

      setDoctor(doctorData);

      // Slots
      const slotRes = await fetch(
        `http://localhost:8000/api/doctors/${doctorId}/slots?date=${selectedDate}`
      );

      const slotData = await slotRes.json();

      setSlots(slotData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook() {
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }

    const response = await fetch(
      "http://localhost:8000/api/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          patient_id: 1, // Replace later with logged in patient
          date: selectedDate,
          time: selectedSlot,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Appointment booked successfully!");

      loadDoctor();
      setSelectedSlot("");
    } else {
      alert(data.message);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Doctor not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-lg">

        <h1 className="text-3xl font-bold">
          Book Appointment
        </h1>

        <p className="mt-2 text-gray-500">
          Choose your preferred appointment date and time.
        </p>

        {/* Doctor */}

        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
              <User />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {doctor.name}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-blue-600">
                <Stethoscope size={18} />
                {doctor.specialty}
              </div>
            </div>

          </div>

        </div>

        {/* Date */}

        <div className="mt-8">

          <label className="mb-2 flex items-center gap-2 font-medium">
            <Calendar size={18} />
            Appointment Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

        </div>

        {/* Slots */}

        <div className="mt-8">

          <div className="mb-4 flex items-center gap-2">
            <Clock size={18} />
            <h2 className="text-lg font-semibold">
              Available Time Slots
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            {slots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.time)}
                className={`rounded-lg border p-3 transition

                  ${
                    !slot.available
                      ? "cursor-not-allowed border-red-300 bg-red-100 text-red-700"
                      : selectedSlot === slot.time
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  }
                `}
              >
                {slot.time}

                {!slot.available && (
                  <div className="mt-1 text-xs">
                    Booked
                  </div>
                )}

              </button>
            ))}

          </div>

        </div>

        {selectedSlot && (
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            Selected Slot:
            <span className="ml-2 font-semibold text-blue-600">
              {selectedSlot}
            </span>
          </div>
        )}

        <button
          onClick={handleBook}
          className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700"
        >
          Confirm Appointment
        </button>

      </div>
    </main>
  );
}