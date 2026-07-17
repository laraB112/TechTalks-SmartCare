"use client";

import { useEffect, useState } from "react";
import DashboardStats from "../components/DashboardStats";
import TodayAppointments from "../components/TodayAppointments";

interface Appointment {
  id: number;
  status: string;
  date: string;
}

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState({
    todayCount: 0,
    totalCount: 0,
    pendingCount: 0,
    completedCount: 0,
  });
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://TechTalks-SmartCare.test/api/doctor/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch appointments for stats");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const appointments = data.data || data || [];

      const today = new Date().toISOString().split("T")[0];

      let todayCount = 0;
      let pendingCount = 0;
      let completedCount = 0;

      appointments.forEach((a: any) => {
        const status = a.status?.toLowerCase() || '';
        const aptDate = a.appointment_date || a.date || '';

        //  Today's appointments only
        if (aptDate.includes(today)) {
          todayCount++;
        }

        //  All pending/accepted/waiting (any date)
        if (status === 'pending' || status === 'accepted' || status === 'waiting') {
          pendingCount++;
        }

        //  All completed (any date)
        if (status === 'completed') {
          completedCount++;
        }
      });

      setStats({
        todayCount,          // Today only
        totalCount: appointments.length,  // All
        pendingCount,        // All pending
        completedCount,      // All completed
      });
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshData = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="ml-3 text-gray-500">Loading dashboard...</span>
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