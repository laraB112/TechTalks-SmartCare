"use client";

import { useState } from "react";
import {
  Calendar,
  Stethoscope,
  UserRound,
  Video,
  Building2,
} from "lucide-react";

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
];

export default function AppointmentForm() {
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <form className="space-y-8">
        {/* First Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Specialty */}
          <div>
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <Stethoscope size={18} />
              Specialty
            </label>

            <select className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600">
              <option>Select Specialty</option>
              <option>Cardiology</option>
              <option>Dermatology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <UserRound size={18} />
              Doctor
            </label>

            <select className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600">
              <option>Select Doctor</option>
              <option>Dr. Sarah Johnson</option>
              <option>Dr. Michael Lee</option>
              <option>Dr. Emily Davis</option>
            </select>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Date */}
          <div>
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <Calendar size={18} />
              Appointment Date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          {/* Visit Type */}
          <div>
            <label className="mb-2 font-medium text-gray-700">
              Visit Type
            </label>

            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-4 py-3">
                <input type="radio" name="visitType" defaultChecked />
                <Building2 size={18} />
                In Person
              </label>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-4 py-3">
                <input type="radio" name="visitType" />
                <Video size={18} />
                Video Call
              </label>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="mb-4 font-medium text-gray-700">
            Available Time Slots
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`rounded-xl border px-4 py-3 transition
                  ${
                    selectedTime === time
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 hover:border-blue-600 hover:text-blue-600"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Reason for Visit
          </label>

          <textarea
            rows={5}
            placeholder="Describe the reason for your appointment..."
            className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="rounded-xl border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
}