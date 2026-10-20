
import { Search, MessageCircle, Stethoscope } from "lucide-react";

export default function EmptyState() {
  return (
    <section className="rounded-2xl border border-[#D9EAF0] bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7FB] text-[#0E7490]">
          <Search size={26} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            No specific specialty found
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We couldn't match your description to one of the specialties in
            our current symptom guide. You can try adding more detail or browse
            the doctors listed below.
          </p>

          <div className="mt-4 flex flex-col gap-3 text-left sm:flex-row sm:flex-wrap">
            <div className="flex items-start gap-2 text-sm text-slate-500">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0E7490]" />
              Describe where you feel discomfort and what symptoms you notice.
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-500">
              <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-[#0E7490]" />
              A healthcare professional can help assess your symptoms.
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            This tool offers general specialty guidance and does not provide a
            diagnosis. For severe or sudden symptoms, seek urgent medical care.
          </p>
        </div>
      </div>
    </section>
  );
}
