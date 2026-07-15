"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Loader2,
  CalendarPlus,
  ChevronRight,
  Circle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
} from "lucide-react";

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  queue_position?: number;
  doctor: {
    id: number;
    user: {
      name: string;
    };
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first");
          router.push("/login");
          return;
        }

        const response = await fetch("http://TechTalks-SmartCare.test/api/appointments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please login again.");
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const appointmentsData = data.data || data || [];
        setAppointments(appointmentsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
      pending: {
        label: "Pending",
        icon: <ClockIcon className="w-3 h-3" />,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      accepted: {
        label: "Accepted",
        icon: <CheckCircle className="w-3 h-3" />,
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      in_progress: {
        label: "In Progress",
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      completed: {
        label: "Completed",
        icon: <CheckCircle className="w-3 h-3" />,
        color: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        label: "Rejected",
        icon: <XCircle className="w-3 h-3" />,
        color: "bg-red-100 text-red-800 border-red-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: <XCircle className="w-3 h-3" />,
        color: "bg-gray-100 text-gray-700 border-gray-200",
      },
    };
    return statusMap[status?.toLowerCase()] || {
      label: status || "Unknown",
      icon: <Circle className="w-3 h-3" />,
      color: "bg-gray-100 text-gray-700 border-gray-200",
    };
  };

  
  const getNextAppointment = () => {
    const today = new Date().toISOString().split("T")[0];
    const upcoming = appointments
      .filter((a) => a.date >= today && a.status !== "completed" && a.status !== "cancelled" && a.status !== "rejected")
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.time || "").localeCompare(b.time || "");
      });
    return upcoming[0] || null;
  };

  const nextAppointment = getNextAppointment();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-gray-600 text-sm sm:text-base">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 flex items-center gap-3 max-w-md w-full">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Appointments</h1>
        </div>
        <button
          onClick={() => router.push("/patient/dashboard/book-appointment")}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
        >
          <CalendarPlus className="w-4 h-4" />
          Book New
        </button>
      </div>

      {nextAppointment && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">UPCOMING APPOINTMENT</p>
                <h3 className="text-lg font-bold text-gray-900">
                  {nextAppointment.doctor?.user?.name || "Unknown"}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {nextAppointment.date?.split("T")[0] || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {nextAppointment.time || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              {nextAppointment.queue_position && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-700">
                    Queue Position: #{nextAppointment.queue_position}
                  </span>
                </div>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusConfig(nextAppointment.status).color}`}>
                {getStatusConfig(nextAppointment.status).label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {appointments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No Appointments Yet
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            You haven't booked any appointments. Schedule your first one now!
          </p>
          <button
            onClick={() => router.push("/patient/dashboard/book-appointment")}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            <CalendarPlus className="w-4 h-4" />
            Book Your First Appointment
          </button>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Doctor
                    </div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time
                    </div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Status
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment) => {
                  const statusConfig = getStatusConfig(appointment.status);
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 rounded-lg">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {appointment.doctor?.user?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {appointment.date?.split("T")[0] || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {appointment.time || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-gray-100">
            {appointments.map((appointment) => {
              const statusConfig = getStatusConfig(appointment.status);
              return (
                <div key={appointment.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          Dr. {appointment.doctor?.user?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-900">
                            {appointment.date?.split("T")[0] || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-900">
                            {appointment.time || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}