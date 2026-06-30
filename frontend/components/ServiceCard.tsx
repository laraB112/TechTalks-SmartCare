import { ArrowRight } from "lucide-react";
import Link, { LinkProps } from "next/link";


type Props = {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    href: LinkProps["href"];
};

export default function ServiceCard({ icon, title, description, href, iconBg }: Props) {
    return (
        <div className=" group flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)]">
             {/* Icon */}
           <div className={` flex h-24 w-24 items-center justify-center rounded-full ${iconBg}`}>
            {icon}
           </div>
              {/* Title */}
              <div className="mt-4 font-bold text-xl text-slate-900">
                {title}
              </div>
              {/* Description */}
              <div className="flex-1 mt-2 text-md leading-7 text-slate-500">
                {description}
              </div>
              {/* Link */}
              <Link 
              href={href}
              className="mt-auto inline-flex items-center gap-2 text-md font-semibold text-blue-600 transition-all group-hover:gap-3">
                Learn More
                <ArrowRight size={18}/>
              </Link>
        </div>
    );
}