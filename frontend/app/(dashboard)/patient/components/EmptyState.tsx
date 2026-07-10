import { AlertCircle } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />

      <h3 className="text-xl font-semibold text-gray-900">
        No Specialty Found
      </h3>

      <p className="mt-2 text-gray-600">
        We couldn't determine the appropriate specialty from your symptoms.
        Please describe your symptoms with more detail or contact our support
        team for assistance.
      </p>
    </div>
  );
}