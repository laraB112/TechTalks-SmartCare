"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import AppointmentTable from "./AppointmentTable";

const API_URL = "http://TechTalks-SmartCare.test/api";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  patientName: string;
  phone: string;
  age: number;
  gender: string;
  status: string;
}

interface TodayAppointmentsProps {
  onRefresh?: () => void;
  onAppointmentsChange?: (appointments: Appointment[]) => void;
}

export default function TodayAppointments({ onRefresh, onAppointmentsChange }: TodayAppointmentsProps) {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getDoctorAppointments(date: string) {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/doctor/appointments?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const appointmentsData = data.data || data || [];

      const mappedAppointments = appointmentsData.map((item: any) => ({
        id: item.id,
        date: item.appointment_date || item.date || '',
        time: item.time_slot || item.time || '',
        patientName: item.patient?.name || item.patient_name || 'Unknown Patient',
        phone: item.patient?.phone || item.phone || 'N/A',
        age: item.patient?.age || item.age || 0,
        gender: item.patient?.gender || item.gender || 'Not specified',
        status: formatStatus(item.status),
      }));

      setAppointments(mappedAppointments);

      if (onAppointmentsChange) {
        onAppointmentsChange(mappedAppointments);
      }
    } catch (error) {
      setError("Failed to load appointments. Please try again.");
      setAppointments([]);
      if (onAppointmentsChange) {
        onAppointmentsChange([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'accepted': 'Waiting',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'rejected': 'Rejected',
      'cancelled': 'Cancelled',
    };
    return statusMap[status?.toLowerCase()] || status || 'Pending';
  };

  const handleRefresh = () => {
    getDoctorAppointments(selectedDate);
    if (onRefresh) onRefresh();
  };

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
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {title}
          </h2>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}

      <AppointmentTable
        appointments={appointments}
        loading={loading}
        onStatusUpdate={handleRefresh}
      />
    </section>
  );
}