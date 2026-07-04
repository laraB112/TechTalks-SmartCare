

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
};


export default function FeatureCard({ icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center w-full rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mb-3 text-lg sm:text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-centerleading-7 text-gray-500">
        {description}
      </p>
    </div>
  )
}