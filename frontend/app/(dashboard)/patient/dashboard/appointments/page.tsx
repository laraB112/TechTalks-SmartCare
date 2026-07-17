"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Loader2,
  CalendarPlus,
  Circle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Trash2,
  RefreshCw,
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
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [rescheduling, setRescheduling] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

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

  // Cancel Appointment
  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;

    setCancelling(selectedAppointment.id);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://TechTalks-SmartCare.test/api/patient/appointments/${selectedAppointment.id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            reason: cancelReason || "Cancelled by patient",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel appointment");
      }

      setAppointments(
        appointments.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, status: "cancelled" }
            : apt
        )
      );

      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason("");
    } catch (err: any) {
      alert(err.message || "Failed to cancel appointment. Please try again.");
    } finally {
      setCancelling(null);
    }
  };

  // Reschedule Appointment
  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate("");
    setNewTime("");
    setAvailableSlots([]);
    setShowRescheduleModal(true);
  };

  const fetchAvailableSlots = async (date: string) => {
    if (!selectedAppointment || !date) return;

    setFetchingSlots(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://TechTalks-SmartCare.test/api/doctors/${selectedAppointment.doctor.id}/available-slots?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }

      const data = await response.json();
      const allSlots = data.all_slots || [];
      const available = data.available_slots || [];
      setAvailableSlots(available);
    } catch (err) {
      console.error("Error fetching slots:", err);
      alert("Could not load available slots. Please try again.");
    } finally {
      setFetchingSlots(false);
    }
  };

  const confirmReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    setRescheduling(selectedAppointment.id);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://TechTalks-SmartCare.test/api/appointments/${selectedAppointment.id}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            date: newDate,
            time: newTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reschedule appointment");
      }

      setAppointments(
        appointments.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, date: newDate, time: newTime, status: "pending" }
            : apt
        )
      );

      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");
      setAvailableSlots([]);
    } catch (err: any) {
      alert(err.message || "Failed to reschedule appointment. Please try again.");
    } finally {
      setRescheduling(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
      pending: {
        label: "Pending",
        icon: <ClockIcon className="w-3 h-3" />,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      accepted: {
        label: "Waiting",
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

  const canCancel = (status: string, date: string) => {
    const today = new Date().toISOString().split("T")[0];
    const cancelableStatuses = ["pending", "accepted", "waiting"];
    return cancelableStatuses.includes(status?.toLowerCase()) && date >= today;
  };

  const canReschedule = (status: string, date: string) => {
    const today = new Date().toISOString().split("T")[0];
    const reschedulableStatuses = ["pending", "accepted", "waiting"];
    return reschedulableStatuses.includes(status?.toLowerCase()) && date >= today;
  };

  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
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
      {/* Header */}
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

      {/* Next Appointment Card */}
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
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment) => {
                  const statusConfig = getStatusConfig(appointment.status);
                  const canCancelAppointment = canCancel(appointment.status, appointment.date);
                  const canRescheduleAppointment = canReschedule(appointment.status, appointment.date);
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
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 flex-wrap">
                          {canRescheduleAppointment && (
                            <button
                              onClick={() => handleReschedule(appointment)}
                              disabled={rescheduling === appointment.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                            >
                              {rescheduling === appointment.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3 h-3" />
                              )}
                              Reschedule
                            </button>
                          )}
                          {canCancelAppointment && (
                            <button
                              onClick={() => handleCancel(appointment)}
                              disabled={cancelling === appointment.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                            >
                              {cancelling === appointment.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                              Cancel
                            </button>
                          )}
                        </div>
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
              const canCancelAppointment = canCancel(appointment.status, appointment.date);
              const canRescheduleAppointment = canReschedule(appointment.status, appointment.date);
              return (
                <div key={appointment.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                           {appointment.doctor?.user?.name || "N/A"}
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
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {canRescheduleAppointment && (
                      <button
                        onClick={() => handleReschedule(appointment)}
                        disabled={rescheduling === appointment.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                      >
                        {rescheduling === appointment.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        Reschedule
                      </button>
                    )}
                    {canCancelAppointment && (
                      <button
                        onClick={() => handleCancel(appointment)}
                        disabled={cancelling === appointment.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                      >
                        {cancelling === appointment.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Cancel Appointment</h2>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your appointment with{" "}
              <span className="font-semibold text-gray-900">
               {selectedAppointment.doctor?.user?.name}
              </span>{" "}
              on{" "}
              <span className="font-semibold text-gray-900">
                {selectedAppointment.date?.split("T")[0]}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-gray-900">
                {selectedAppointment.time}
              </span>
              ?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Why are you cancelling?"
                rows={2}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmCancel}
                disabled={cancelling === selectedAppointment.id}
                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {cancelling === selectedAppointment.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Yes, Cancel
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancelReason("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Reschedule Appointment</h2>
            </div>

            <p className="text-gray-600 mb-4">
              Reschedule your appointment with{" "}
              <span className="font-semibold text-gray-900">
                {selectedAppointment.doctor?.user?.name}
              </span>{" "}
              from{" "}
              <span className="font-semibold text-gray-900">
                {selectedAppointment.date?.split("T")[0]}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-gray-900">
                {selectedAppointment.time}
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Date *
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    if (e.target.value) {
                      fetchAvailableSlots(e.target.value);
                    }
                  }}
                  min={getMinDate()}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              {newDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Time *
                  </label>
                  {fetchingSlots ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">Loading available slots...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setNewTime(slot)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition ${newTime === slot
                            ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No available slots for this date.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={confirmReschedule}
                disabled={rescheduling === selectedAppointment.id || !newDate || !newTime}
                className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {rescheduling === selectedAppointment.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Confirm Reschedule
              </button>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedAppointment(null);
                  setNewDate("");
                  setNewTime("");
                  setAvailableSlots([]);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}