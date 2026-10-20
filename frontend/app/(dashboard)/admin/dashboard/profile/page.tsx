"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, ElementType } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Phone,
    CalendarDays,
    MapPin,
    Pencil,
    Save,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    UserCircle,
    ShieldCheck,
    HeartPulse,
    RefreshCw,
    Clock3,
} from "lucide-react";

interface AdminProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    role: string;
    city?: string;
    address?: string;
    created_at: string;
}

interface ProfileForm {
    name: string;
    phone: string;
    city: string;
    address: string;
    age: string;
}

const API_URL = "http://TechTalks-SmartCare.test/api/admin/profile";

const emptyForm: ProfileForm = {
    name: "",
    phone: "",
    city: "",
    address: "",
    age: "",
};

export default function AdminProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<ProfileForm>(emptyForm);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    response.status === 403
                        ? "You don't have permission to view this profile."
                        : "Failed to load your profile. Please try again."
                );
            }

            const data = await response.json();
            const result = data.data ?? data;

            setProfile(result);
            setFormData({
                name: result.name ?? "",
                phone: result.phone ?? "",
                city: result.city ?? "",
                address: result.address ?? "",
                age:
                    result.age !== null && result.age !== undefined
                        ? String(result.age)
                        : "",
            });
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const resetForm = () => {
        if (profile) {
            setFormData({
                name: profile.name ?? "",
                phone: profile.phone ?? "",
                city: profile.city ?? "",
                address: profile.address ?? "",
                age:
                    profile.age !== null && profile.age !== undefined
                        ? String(profile.age)
                        : "",
            });
        } else {
            setFormData(emptyForm);
        }
    };

    const handleCancel = () => {
        resetForm();
        setEditing(false);
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            setError("Please enter your full name.");
            return;
        }

        const parsedAge = formData.age.trim()
            ? Number(formData.age)
            : null;

        if (
            parsedAge !== null &&
            (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 150)
        ) {
            setError("Please enter a valid age between 1 and 150.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: trimmedName,
                    phone: formData.phone.trim(),
                    city: formData.city.trim(),
                    address: formData.address.trim(),
                    age: parsedAge,
                }),
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
                return;
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const validationErrors = data.errors
                    ? Object.values(data.errors).flat().join(" ")
                    : "";

                throw new Error(
                    validationErrors ||
                    data.message ||
                    "Failed to update your profile."
                );
            }

            const updatedProfile: AdminProfile = {
                ...profile!,
                ...(data.data ?? {}),
                name: trimmedName,
                phone: formData.phone.trim(),
                city: formData.city.trim(),
                address: formData.address.trim(),
                age: parsedAge ?? 0,
            };

            setProfile(updatedProfile);
            setFormData({
                name: updatedProfile.name ?? "",
                phone: updatedProfile.phone ?? "",
                city: updatedProfile.city ?? "",
                address: updatedProfile.address ?? "",
                age:
                    updatedProfile.age
                        ? String(updatedProfile.age)
                        : "",
            });
            setEditing(false);
            setSuccess("Your profile has been updated successfully.");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                    <Loader2 className="h-7 w-7 animate-spin text-teal-700" />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-slate-800">
                        Loading your profile
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Just a moment...
                    </p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900">
                    Unable to load profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {error || "No profile information was found."}
                </p>
                <button
                    type="button"
                    onClick={fetchProfile}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Page heading */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
                        <HeartPulse className="h-4 w-4" />
                        SmartCare administration
                    </div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        My profile
                    </h1>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        Manage your personal information and account details.
                    </p>
                </div>

                {!editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            setSuccess("");
                            resetForm();
                            setEditing(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/20"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit profile
                    </button>
                )}
            </div>

            {/* Feedback messages */}
            {success && (
                <div
                    role="status"
                    className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800"
                >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="flex-1">{success}</p>
                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                        aria-label="Dismiss success message"
                        className="rounded-lg p-1 transition hover:bg-emerald-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800"
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="flex-1">{error}</p>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss error message"
                        className="rounded-lg p-1 transition hover:bg-red-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Profile identity banner */}
            <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#075C70] via-[#08758A] to-[#0E7490] p-6 shadow-sm sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-1 -top-7 -z-10 h-36 w-36 rounded-full border border-white/10" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-inner sm:h-24 sm:w-24">
                        <ShieldCheck className="h-11 w-11 sm:h-12 sm:w-12" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-2xl font-bold text-white sm:text-3xl">
                                {profile.name || "Admin"}
                            </h2>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold capitalize text-white">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                {profile.role || "Admin"}
                            </span>
                        </div>

                        <p className="mt-2 flex items-center gap-2 break-all text-sm text-teal-50/90">
                            <Mail className="h-4 w-4 shrink-0" />
                            {profile.email}
                        </p>

                        <p className="mt-3 flex items-center gap-2 text-xs text-teal-50/75">
                            <UserCircle className="h-4 w-4" />
                            Administrator account
                        </p>
                    </div>

                    {editing && (
                        <div className="flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white sm:self-center">
                            <Pencil className="h-3.5 w-3.5" />
                            Editing profile
                        </div>
                    )}
                </div>
            </section>

            {/* Profile content */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        {editing ? (
                            <Pencil className="h-5 w-5" />
                        ) : (
                            <UserCircle className="h-5 w-5" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">
                            {editing ? "Edit personal information" : "Personal information"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {editing
                                ? "Update your details below and save your changes."
                                : "Your account details and contact information."}
                        </p>
                    </div>
                </div>

                {editing ? (
                    <form onSubmit={handleSubmit} className="p-5 sm:p-7">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <FormField label="Full name" icon={User} required>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    required
                                    maxLength={255}
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="Phone number" icon={Phone}>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    placeholder="Enter your phone number"
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="City" icon={MapPin}>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    autoComplete="address-level2"
                                    placeholder="Enter your city"
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="Age" icon={CalendarDays}>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min={1}
                                    max={150}
                                    step={1}
                                    placeholder="Enter your age"
                                    className={inputClass}
                                />
                            </FormField>

                            <div className="sm:col-span-2">
                                <FormField label="Address" icon={MapPin}>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        autoComplete="street-address"
                                        placeholder="Enter your full address"
                                        rows={3}
                                        className={`${inputClass} resize-y`}
                                    />
                                </FormField>
                            </div>
                        </div>

                        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-5 sm:p-7">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <ProfileDetail
                                icon={User}
                                label="Full name"
                                value={profile.name}
                            />
                            <ProfileDetail
                                icon={Mail}
                                label="Email address"
                                value={profile.email}
                            />
                            <ProfileDetail
                                icon={Phone}
                                label="Phone number"
                                value={profile.phone}
                            />
                            <ProfileDetail
                                icon={UserCircle}
                                label="Gender"
                                value={profile.gender}
                                capitalize
                            />
                            <ProfileDetail
                                icon={CalendarDays}
                                label="Age"
                                value={
                                    profile.age !== null &&
                                    profile.age !== undefined &&
                                    profile.age !== 0
                                        ? String(profile.age)
                                        : ""
                                }
                                emptyText="Not provided"
                            />
                            <ProfileDetail
                                icon={ShieldCheck}
                                label="Account role"
                                value={profile.role}
                                capitalize
                            />
                            <ProfileDetail
                                icon={MapPin}
                                label="City"
                                value={profile.city}
                            />
                            <ProfileDetail
                                icon={MapPin}
                                label="Address"
                                value={profile.address}
                            />
                        </div>

                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    Account information
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Your email, role, and gender are displayed here.
                                    This form only updates the personal fields supported
                                    by your current profile API.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Account metadata */}
            {!editing && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Admin account
                    </span>
                    {profile.created_at && (
                        <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            Member since{" "}
                            {Number.isNaN(Date.parse(profile.created_at))
                                ? "—"
                                : new Date(profile.created_at).toLocaleDateString(
                                      undefined,
                                      {
                                          month: "short",
                                          year: "numeric",
                                      }
                                  )}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10";

function FormField({
    label,
    icon: Icon,
    required = false,
    children,
}: {
    label: string;
    icon: ElementType;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="min-w-0">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Icon className="h-4 w-4 text-teal-700" />
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function ProfileDetail({
    icon: Icon,
    label,
    value,
    emptyText = "Not provided",
    capitalize = false,
}: {
    icon: ElementType;
    label: string;
    value?: string | number | null;
    emptyText?: string;
    capitalize?: boolean;
}) {
    const displayValue =
        value !== null && value !== undefined && String(value).trim() !== ""
            ? String(value)
            : emptyText;

    const isEmpty = displayValue === emptyText;

    return (
        <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-teal-100 hover:bg-teal-50/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-100">
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p
                    className={`mt-1 break-words text-sm font-semibold ${
                        isEmpty
                            ? "text-slate-400"
                            : "text-slate-800"
                    } ${capitalize ? "capitalize" : ""}`}
                >
                    {displayValue}
                </p>
            </div>
        </div>
    );
}