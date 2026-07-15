"use client";

import { useState } from "react";
import { Appointment } from "./TodayAppointments";
import { Check, X, Play, CheckCircle, Loader2 } from "lucide-react";

interface Props {
  appointment: Appointment;
  onStatusUpdate?: () => void;
}

export default function AppointmentRow({ appointment, onStatusUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const statusStyle: Record<string, string> = {
    Waiting: "bg-yellow-100 text-yellow-700",
    Pending: "bg-blue-100 text-blue-700",
    "In Progress": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-gray-100 text-gray-700",
  };

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://TechTalks-SmartCare.test/api/doctor/appointments/${appointment.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

     
      const data = await response.json();


      if (response.ok) {
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const status = appointment.status?.toLowerCase() || '';


  const canAccept = status === 'pending';
  const canReject = status === 'pending' || status === 'waiting';
  const canStart = status === 'waiting' || status === 'accepted';
  const canComplete = status === 'in_progress' || status === 'in progress';
  const isCompleted = status === 'completed';
  const isRejected = status === 'rejected';
  const isCancelled = status === 'cancelled';

  const showActions = !isCompleted && !isRejected && !isCancelled;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-gray-900 text-sm">
        {appointment.time}
      </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5 text-gray-900 text-sm">
        {appointment.patientName}
      </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5 text-gray-700 text-sm hidden sm:table-cell">
        {appointment.phone}
      </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5 text-gray-700 text-sm hidden md:table-cell">
        {appointment.age} / {appointment.gender}
      </td>
      <td className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle[appointment.status] || "bg-gray-100 text-gray-700"
              }`}
          >
            {appointment.status}
          </span>

          {showActions && !loading && (
            <>
              {canAccept && (
                <button
                  onClick={() => handleAction("accept")}
                  className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                  title="Accept"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}

              {canReject && (
                <button
                  onClick={() => handleAction("reject")}
                  className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  title="Reject"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {canStart && (
                <button
                  onClick={() => handleAction("start")}
                  className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  title="Start"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}

              {canComplete && (
                <button
                  onClick={() => handleAction("complete")}
                  className="p-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                  title="Complete"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {loading && (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>
      </td>
    </tr>
  );
}