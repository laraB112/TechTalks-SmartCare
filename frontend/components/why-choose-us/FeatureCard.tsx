
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="group flex h-full min-w-0 items-start gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-[0_12px_30px_rgba(7,92,112,0.07)] sm:gap-4 sm:rounded-2xl sm:p-5 lg:p-6">
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf6fa] text-[#075c70] transition-colors duration-300 group-hover:bg-[#075c70] group-hover:text-white sm:h-11 sm:w-11 sm:rounded-xl">
        <span className="[&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
          {icon}
        </span>
      </div>

      {/* Text */}
      <div className="min-w-0 pt-0.5">
        <h3 className="text-[11px] font-semibold leading-4 text-slate-900 sm:text-base sm:leading-6">
          {title}
        </h3>

        <p className="mt-1 text-[10px] leading-[1.5] text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
          {description}
        </p>
      </div>
    </article>
  );
}
