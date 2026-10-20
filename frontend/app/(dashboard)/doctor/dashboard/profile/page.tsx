"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserCircle,
  HeartPulse,
  Briefcase,
  DollarSign,
  Stethoscope,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface DoctorProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  specialization: string;
  specialization_id: number;
  experience_years: number;
  consultation_fee: number;
  city: string;
  address: string;
  bio: string;
  is_available: boolean;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-50";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-slate-700";

export default function DoctorProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    bio: "",
    consultation_fee: "",
    experience_years: "",
    is_available: true,
    age: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/doctor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const profileData = data.data || data;

      setProfile(profileData);

      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
        city: profileData.city || "",
        address: profileData.address || "",
        bio: profileData.bio || "",
        consultation_fee:
          profileData.consultation_fee?.toString() || "",
        experience_years:
          profileData.experience_years?.toString() || "",
        is_available: profileData.is_available ?? true,
        age: profileData.age?.toString() || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Unable to load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/doctor/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            address: formData.address,
            bio: formData.bio,
            consultation_fee:
              parseFloat(formData.consultation_fee) || 0,
            experience_years:
              parseInt(formData.experience_years) || 0,
            is_available: formData.is_available,
            age: formData.age ? parseInt(formData.age) : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedProfile: DoctorProfile = {
        ...profile!,
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        bio: formData.bio,
        consultation_fee:
          parseFloat(formData.consultation_fee) || 0,
        experience_years:
          parseInt(formData.experience_years) || 0,
        is_available: formData.is_available,
        age: formData.age ? parseInt(formData.age) : 0,
      };

      setProfile(updatedProfile);
      setSuccess("Your profile has been updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        address: profile.address || "",
        bio: profile.bio || "",
        consultation_fee:
          profile.consultation_fee?.toString() || "",
        experience_years:
          profile.experience_years?.toString() || "",
        is_available: profile.is_available ?? true,
        age: profile.age?.toString() || "",
      });
    }

    setEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50">
            <Loader2 className="h-7 w-7 animate-spin text-[#0E7490]" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <AlertCircle className="h-7 w-7 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Unable to load profile
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchProfile}
            className="mt-5 rounded-xl bg-[#075C70] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064B5B]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-slate-500">
          No profile data found.
        </p>
      </div>
    );
  }

  const initials =
    profile.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "DR";

  const details = [
    {
      label: "Full name",
      value: profile.name,
      icon: User,
    },
    {
      label: "Email address",
      value: profile.email,
      icon: Mail,
    },
    {
      label: "Phone number",
      value: profile.phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Gender",
      value: profile.gender || "Not specified",
      icon: UserCircle,
      capitalize: true,
    },
    {
      label: "Age",
      value: profile.age || "Not provided",
      icon: Calendar,
    },
    {
      label: "Experience",
      value: `${profile.experience_years ?? 0} years`,
      icon: Briefcase,
    },
    {
      label: "Consultation fee",
      value: `$${profile.consultation_fee ?? 0}`,
      icon: DollarSign,
    },
    {
      label: "City",
      value: profile.city || "Not provided",
      icon: MapPin,
    },
    {
      label: "Address",
      value: profile.address || "Not provided",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-full bg-slate-50/60 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0E7490]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0E7490]" />
              Doctor dashboard
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
              Manage your professional information and appointment
              availability.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setEditing(true);
              }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#075C70] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#064B5B] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-cyan-100 sm:self-auto"
            >
              <Edit className="h-4 w-4" />
              Edit profile
            </button>
          )}
        </div>

        {/* Feedback messages */}
        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="flex-1">{success}</div>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
              className="rounded-lg p-1 text-emerald-700 transition hover:bg-emerald-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && profile && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error message"
              className="rounded-lg p-1 transition hover:bg-rose-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Profile banner */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-[#DCEEF3] bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-[#075C70] via-[#0E7490] to-cyan-300" />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#075C70] to-[#0E7490] text-xl font-bold text-white shadow-md shadow-cyan-900/10 sm:h-20 sm:w-20 sm:text-2xl">
                {initials}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                  {profile.name}
                </h2>

                <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-[#0E7490]">
                  <Stethoscope className="h-4 w-4 shrink-0" />
                  <span>{profile.specialization || "Doctor"}</span>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-[#0E7490]" />
                  Professional profile
                </div>
              </div>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold ${
                profile.is_available
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  profile.is_available ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {profile.is_available ? "Available for appointments" : "Currently unavailable"}
            </div>
          </div>
        </section>

        {/* Profile information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editing ? "Edit your information" : "Personal information"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editing
                  ? "Update your details using the fields below."
                  : "Your contact details and professional information."}
              </p>
            </div>

            {!editing && (
              <span className="w-fit rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                Profile details
              </span>
            )}
          </div>

          {!editing ? (
            <div className="p-5 sm:p-7">
              <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                {details.map(({ label, value, icon: Icon, capitalize }) => (
                  <div key={label} className="flex min-w-0 items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#0E7490]">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-medium text-slate-500">
                        {label}
                      </p>
                      <p
                        className={`mt-1 break-words text-sm font-semibold text-slate-800 ${
                          capitalize ? "capitalize" : ""
                        }`}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex min-w-0 items-start gap-3.5 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#0E7490]">
                    <Stethoscope className="h-[18px] w-[18px]" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-medium text-slate-500">
                      Professional bio
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {profile.bio || "No professional bio provided yet."}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3.5 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#0E7490]">
                    <Clock className="h-[18px] w-[18px]" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-medium text-slate-500">
                      Appointment availability
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        profile.is_available
                          ? "text-emerald-700"
                          : "text-slate-600"
                      }`}
                    >
                      {profile.is_available
                        ? "Accepting appointments"
                        : "Not currently accepting appointments"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 sm:p-7">
              <div className="mb-6 rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0E7490] shadow-sm">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Keep your profile up to date
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Accurate contact and professional information helps
                      patients understand your services.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label htmlFor="address" className={labelClass}>
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label htmlFor="experience_years" className={labelClass}>
                    Experience (years)
                  </label>
                  <input
                    id="experience_years"
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    min="0"
                    className={inputClass}
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <label htmlFor="consultation_fee" className={labelClass}>
                    Consultation fee ($)
                  </label>
                  <input
                    id="consultation_fee"
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={inputClass}
                    placeholder="e.g. 30"
                  />
                </div>

                <div>
                  <label htmlFor="age" className={labelClass}>
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="150"
                    className={inputClass}
                    placeholder="Enter your age"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className={labelClass}>
                    Professional bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputClass} resize-y`}
                    placeholder="Introduce yourself and describe your professional experience..."
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Keep it clear and helpful for patients.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="is_available"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#B9DFE8] hover:bg-[#F8FCFD]"
                  >
                    <input
                      id="is_available"
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleChange}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 accent-[#075C70] focus:ring-[#0E7490]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        Available for appointments
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Allow patients to see you as available for booking.
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        formData.is_available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formData.is_available ? "On" : "Off"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075C70] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064B5B] focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
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
          )}
        </section>

        <p className="mt-5 text-center text-xs text-slate-400">
          SmartCare · Doctor profile
        </p>
      </div>
    </div>
  );
}