"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardStats from "../components/DashboardStats";
import TodayAppointments from "../components/TodayAppointments";

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState({
    todayCount: 0,
    totalCount: 0,
    pendingCount: 0,
    completedCount: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/doctor/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch appointments for stats");
        return;
      }

      const data = await response.json();
      const appointments = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

      // Use the browser's local date instead of UTC.
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const today = `${year}-${month}-${day}`;

      let todayCount = 0;
      let pendingCount = 0;
      let completedCount = 0;

      appointments.forEach((appointment: any) => {
        const status = appointment.status?.toLowerCase() || "";
        const appointmentDate =
          appointment.appointment_date || appointment.date || "";

        if (String(appointmentDate).slice(0, 10) === today) {
          todayCount++;
        }

        if (
          ["pending", "accepted", "waiting"].includes(status)
        ) {
          pendingCount++;
        }

        if (status === "completed") {
          completedCount++;
        }
      });

      setStats({
        todayCount,
        totalCount: appointments.length,
        pendingCount,
        completedCount,
      });
    } catch (error) {
      console.error("Error fetching doctor dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refreshData = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="ml-3 text-gray-500">
          Loading dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <DashboardStats {...stats} />
      <TodayAppointments onRefresh={refreshData} />
    </div>
  );
}