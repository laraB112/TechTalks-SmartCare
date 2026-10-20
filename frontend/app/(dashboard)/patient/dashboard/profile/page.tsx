"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserCircle,
  Clock,
  HeartPulse,
  ArrowLeft,
  MapPin,
} from "lucide-react";

interface ProfileUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: number;
  role: string;
}

type ProfileFormData = {
  name: string;
  phone: string;
  gender: string;
  age: string;
};

const initialFormData: ProfileFormData = {
  name: "",
  phone: "",
  gender: "",
  age: "",
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] =
    useState<ProfileFormData>(initialFormData);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        router.replace("/login");
        return;
      }

      const parsedUser: ProfileUser = JSON.parse(userData);

      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        phone: parsedUser.phone || "",
        gender: parsedUser.gender || "",
        age:
          parsedUser.age !== undefined && parsedUser.age !== null
            ? String(parsedUser.age)
            : "",
      });
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      age:
        user.age !== undefined && user.age !== null
          ? String(user.age)
          : "",
    });

    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/user/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            gender: formData.gender || null,
            age: formData.age ? Number(formData.age) : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      const updatedUser: ProfileUser = {
        ...user,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        age: formData.age ? Number(formData.age) : undefined,
      };

      setUser(updatedUser);
      setFormData({
        ...formData,
        name: updatedUser.name,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Your profile has been updated successfully.");
      setIsEditing(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[#0E8498]" />
          <p className="text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const details = [
    {
      label: "Full name",
      value: user.name || "Not provided",
      icon: User,
    },
    {
      label: "Email address",
      value: user.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Phone number",
      value: user.phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Gender",
      value: user.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
        : "Not provided",
      icon: UserCircle,
    },
    {
      label: "Age",
      value: user.age ? `${user.age} years old` : "Not provided",
      icon: Calendar,
    },
    {
      label: "Account role",
      value: user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User",
      icon: Shield,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
      {/* Page heading */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-[#075C70]"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7FA] text-[#075C70]">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage your personal information and account details.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback messages */}
      {success && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Changes saved</p>
            <p className="mt-0.5">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-0.5 break-words">{error}</p>
          </div>
        </div>
      )}

      {/* Profile overview */}
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#D8EBF0] bg-white shadow-[0_8px_30px_rgba(7,92,112,0.06)]">
        <div className="h-2 bg-gradient-to-r from-[#075C70] via-[#0E8498] to-cyan-200" />

        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-[#EAF7FA] blur-3xl" />

          <div className="relative flex min-w-0 items-center gap-4">
            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#075C70] to-[#0E8498] text-white shadow-lg shadow-[#075C70]/15 sm:h-20 sm:w-20 sm:rounded-3xl">
              <UserCircle
                size={40}
                strokeWidth={1.5}
                className="sm:hidden"
              />
              <UserCircle
                size={46}
                strokeWidth={1.5}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0E8498]">
                SmartCare account
              </p>
              <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                {user.name}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-500">
                {user.email}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#D8EBF0] bg-[#F0FAFC] px-3 py-1 text-xs font-semibold capitalize text-[#075C70]">
                <Shield size={13} />
                {user.role || "User"}
              </span>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setSuccess("");
                setError("");
              }}
              className="relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#075C70] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#064B5B] hover:shadow-md sm:w-auto"
            >
              <Edit size={16} />
              Edit profile
            </button>
          )}
        </div>
      </section>

      {/* Main profile content */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing ? "Edit your information" : "Personal information"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "Update your details below and save your changes."
              : "Your personal details associated with your SmartCare account."}
          </p>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {details.map((detail, index) => {
              const Icon = detail.icon;

              return (
                <div
                  key={detail.label}
                  className={`flex min-w-0 items-start gap-4 p-5 transition-colors hover:bg-[#F8FCFD] sm:p-6 ${
                    index < 4 ? "border-b border-slate-100" : ""
                  } ${
                    index % 2 === 0 ? "sm:border-r sm:border-slate-100" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FA] text-[#0E8498]">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                      {detail.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-800 sm:text-base">
                      {detail.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <User size={16} className="text-[#0E8498]" />
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  maxLength={255}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E8498] focus:bg-white focus:ring-4 focus:ring-[#0E8498]/10"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Mail size={16} className="text-[#0E8498]" />
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Your email address cannot be changed here.
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Phone size={16} className="text-[#0E8498]" />
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={30}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E8498] focus:bg-white focus:ring-4 focus:ring-[#0E8498]/10"
                  placeholder="e.g. +961 123 4567"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <UserCircle size={16} className="text-[#0E8498]" />
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0E8498] focus:bg-white focus:ring-4 focus:ring-[#0E8498]/10"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Clock size={16} className="text-[#0E8498]" />
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
                  step="1"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0E8498] focus:bg-white focus:ring-4 focus:ring-[#0E8498]/10"
                  placeholder="Enter your age"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075C70] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064B5B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Small footer note */}
      <div className="mt-5 flex items-start gap-2.5 px-1 text-xs leading-5 text-slate-500">
        <Shield size={15} className="mt-0.5 shrink-0 text-[#0E8498]" />
        <p>
          Keep your contact information up to date so your healthcare team can
          reach you when needed.
        </p>
      </div>
    </main>
  );
}
