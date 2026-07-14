"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import AppointmentTable from "./AppointmentTable";

const API_URL = "http://techtalks-smartcare.test/api";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  patientName: string;
  phone: string;
  age: number;
  gender: "Male" | "Female";
  issue: string;
  status: "Waiting" | "Pending" | "Completed";
}

export default function TodayAppointments() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  async function getDoctorAppointments(date: string) {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/doctor/appointments?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      setAppointments(data);
    } catch (error) {
      console.error(error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDoctorAppointments(selectedDate);
  }, [selectedDate]);

  const title = useMemo(() => {
    const todayDate = new Date();
    const chosenDate = new Date(selectedDate);

    const isToday =
      todayDate.getFullYear() === chosenDate.getFullYear() &&
      todayDate.getMonth() === chosenDate.getMonth() &&
      todayDate.getDate() === chosenDate.getDate();

    if (isToday) {
      return "Today's Appointments";
    }

    return `Appointments • ${chosenDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }, [selectedDate]);

  return (
    <section className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-8 py-6">

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <CalendarDays className="text-blue-600" />
          </div>

          <h2 className="text-2xl font-semibold">
            {title}
          </h2>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border px-4 py-2"
        />

      </div>

      <AppointmentTable
        appointments={appointments}
        loading={loading}
      />

    </section>
  );
}