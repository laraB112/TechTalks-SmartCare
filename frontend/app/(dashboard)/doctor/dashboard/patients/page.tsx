"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  User,
  Phone,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
  Search,
  Mail,
  CalendarDays,
  Stethoscope,
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  appointments_count: number;
  last_visit: string | null;
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        router.push("/login");
        return;
      }

      const response = await fetch("http://TechTalks-SmartCare.test/api/doctor/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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
      const patientsData = data.data || data || [];
      setPatients(patientsData);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-gray-600 text-sm sm:text-base">Loading patients...</span>
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
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-500">
              {patients.length} patient{patients.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? "No patients found" : "No patients yet"}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Patients will appear here once they book appointments with you."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5"
            >
              {/* Patient Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">{patient.gender}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {patient.appointments_count || 0} visit{patient.appointments_count !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Patient Details */}
              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                {patient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.age && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{patient.age} years old</span>
                  </div>
                )}
                {patient.last_visit && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>Last visit: {new Date(patient.last_visit).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}