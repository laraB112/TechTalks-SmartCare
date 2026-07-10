"use client";

import { useState } from "react";
import { detectSpecialty } from "./triage";
import SuggestedSpecialty from "./SuggestedSpecialty";
import DoctorList from "./DoctorList";
import EmptyState from "./EmptyState";
import { Search } from "lucide-react";

export default function SymptomChecker() {
    const [symptoms, setSymptoms] = useState("");
    const [specialty, setSpecialty] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);


    const handleSearch = () => {
        const result = detectSpecialty(symptoms);

        setSpecialty(result);
        setSearched(true);
    };

    return (
        <section className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-gray-900 flex">
                        Describe Your Symptoms
                    </h2>
                    <p className="text-gray-600 max-w-xl text-start flex">
                        Tell us what you're experiencing, and we'll recommend the most
                        appropriate medical specialty before you book an appointment.
                    </p>
                </div>
                <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={6}
                    placeholder="Example: My heart has been beating very fast for the last few days and I sometimes feel dizzy."
                    className="w-full rounded-xl border border-gray-300 p-4 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <div className="flex justify-center md:justify-start">
                    <button
                        onClick={handleSearch}
                        disabled={!symptoms.trim()}
                        className="flex items-center  gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        <Search size={20} />
                        Find the Right Doctor
                    </button>
                </div>

                {searched && (
                    <>
                        {specialty ? (
                            <>
                                <SuggestedSpecialty specialty={specialty} />
                                <DoctorList specialty={specialty} />
                            </>
                        ) : (
                            <EmptyState />
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

