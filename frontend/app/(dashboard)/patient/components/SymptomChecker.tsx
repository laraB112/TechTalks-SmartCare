"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import DoctorList from "./DoctorList";
import { Doctor } from "./doctor";
import { specialties, Specialty } from "./specialties"; 

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [suggestedSpecialty, setSuggestedSpecialty] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Load all doctors on page load
  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://TechTalks-SmartCare.test/api/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const doctorsData = data.data || [];

      const mappedDoctors = doctorsData.map((doctor: any) => ({
        id: doctor.id,
        name: doctor.name || doctor.user?.name || "Unknown",
        specialty: doctor.specialization?.name || "General",
        experience: doctor.experience_years || 0,
        rating: doctor.rating || 0,
        consultation_fee: doctor.consultation_fee || 0,
        is_available: doctor.is_available,
        profile_photo: doctor.profile_photo,
      }));

      setAllDoctors(mappedDoctors);
      setDoctors(mappedDoctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Could not load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get matching specialty from symptoms using the specialties.ts mapping
  const getMatchingSpecialty = (text: string): Specialty | null => {
    const lowerText = text.toLowerCase();
    
    for (const specialty of specialties) {
      for (const keyword of specialty.keywords) {
        if (lowerText.includes(keyword)) {
          return specialty;
        }
      }
    }
    return null;
  };

  const handleSearch = async () => {
    if (!symptoms.trim()) {
      setDoctors(allDoctors);
      setSuggestedSpecialty(null);
      setHasSearched(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      // ✅ Find matching specialty from symptoms
      const matchedSpecialty = getMatchingSpecialty(symptoms);
      
      if (matchedSpecialty) {
        // ✅ Filter doctors by the matched specialty
        const filtered = allDoctors.filter(
          (doctor) => doctor.specialty.toLowerCase() === matchedSpecialty.name.toLowerCase()
        );
        
        setDoctors(filtered);
        setSuggestedSpecialty(matchedSpecialty.name);
        setError("");
      } else {
        // ✅ No specialty matched - show all doctors with a message
        setDoctors(allDoctors);
        setSuggestedSpecialty(null);
        setError("No specific specialty matched. Showing all available doctors.");
      }

    } catch (err) {
      console.error("Error filtering doctors:", err);
      setError("Could not filter doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Describe Your Symptoms
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Tell us what you're experiencing, and we'll recommend the most appropriate medical specialty.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., My heart has been beating very fast..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none min-h-[80px]"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find the Right Doctor
              </>
            )}
          </button>
        </div>
      </div>

      {suggestedSpecialty && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">
            Suggested Specialty: {suggestedSpecialty}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Based on your symptoms, we recommend seeing a {suggestedSpecialty} specialist.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          {error}
        </div>
      )}

      {!loading && !error && doctors.length === 0 && hasSearched && (
        <div className="text-center py-8 text-gray-500">
          <p>No doctors found matching your symptoms. Please try different keywords.</p>
        </div>
      )}

      <DoctorList doctors={doctors} loading={loading} error={null} />
    </div>
  );
}