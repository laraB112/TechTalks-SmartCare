"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    Plus,
    Users,
    User,
    Mail,
    Phone,
} from "lucide-react";

import { type Patient } from "./patient";

type PatientsPageProps = {
    patients: Patient[];
};

export default function PatientsPage({ patients }: PatientsPageProps) {
    const [search, setSearch] = useState("");

    const filteredPatients = patients.filter(
        (patient) =>
            patient.fullName.toLowerCase().includes(search.toLowerCase()) ||
            patient.email.toLowerCase().includes(search.toLowerCase()) ||
            patient.phone.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                       <span className="text-blue-600">Patients</span>  Management
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage all patients
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="mb-8 max-w-md">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Patients
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {patients.length}
                            </h2>
                        </div>

                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                            <Users size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative w-full max-w-md">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search patient by fullName, email, phoneNumber"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto rounded-xl bg-white shadow md:block">
                <table className="min-w-full">
                    <thead className="border-b bg-gray-50">
                        <tr className="text-left text-sm font-semibold text-gray-600">
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Password</th>
                            <th className="px-6 py-4">Age</th>
                            <th className="px-6 py-4">Gender</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr
                                key={patient.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                                            <User size={20} />
                                        </div>

                                        <div className="flex items-center gap-3">

                                            <div>
                                                <p className="font-semibold">{patient.fullName}</p>
                                                <p className="text-sm text-gray-500">{patient.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    {patient.email}
                                </td>

                                <td className="px-6 py-4">
                                    ••••••••
                                </td>

                                <td className="px-6 py-4">
                                    {patient.age}
                                </td>

                                <td className="px-6 py-4">
                                    {patient.gender}
                                </td>

                                <td className="px-6 py-4">
                                    <button className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white transition hover:bg-red-600">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
                {filteredPatients.map((patient) => (
                    <div
                        key={patient.id}
                        className="rounded-xl bg-white p-5 shadow"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                                <User size={22} />
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800">
                                    {patient.fullName}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {patient.gender}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                {patient.email}
                            </div>

                            <div>
                                <strong>Password:</strong> ••••••••
                            </div>

                            <div>
                                <strong>Age:</strong> {patient.age}
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                {patient.phone}
                            </div>
                        </div>

                        <div className="mt-5 flex ">

                            <button className="flex-1 rounded-lg bg-red-500 py-2 font-medium text-white transition hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}