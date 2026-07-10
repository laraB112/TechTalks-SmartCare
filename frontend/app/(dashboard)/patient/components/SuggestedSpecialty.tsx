import {
  HeartPulse,
  Brain,
  Stethoscope,
  Bone,
  Ear,
  Eye,
  ScanHeart,
  Activity,
} from "lucide-react";

type SuggestedSpecialtyProps = {
  specialty: string;
};

export default function SuggestedSpecialty({specialty}: SuggestedSpecialtyProps) {
  const specialtyConfig: Record<
    string,
    {
      icon: React.ReactNode;
      description: string;
    }
  > = {
    Cardiology: {
      icon: <HeartPulse className="h-8 w-8 text-red-500" />,
      description:
        "Your symptoms may be related to the heart or circulatory system.",
    },
    Neurology: {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      description:
        "Your symptoms may involve the brain, nerves, or nervous system.",
    },
    Dermatology: {
      icon: <Stethoscope className="h-8 w-8 text-emerald-500" />,
      description:
        "Your symptoms appear to be related to the skin, hair, or nails.",
    },
    Orthopedics: {
      icon: <Bone className="h-8 w-8 text-amber-500" />,
      description:
        "Your symptoms may involve bones, joints, muscles, or ligaments.",
    },
    ENT: {
      icon: <Ear className="h-8 w-8 text-cyan-500" />,
      description:
        "Your symptoms may involve the ear, nose, or throat.",
    },
    Ophthalmology: {
      icon: <Eye className="h-8 w-8 text-indigo-500" />,
      description:
        "Your symptoms appear to be related to your eyes or vision.",
    },
    Gastroenterology: {
      icon: <ScanHeart className="h-8 w-8 text-orange-500" />,
      description:
        "Your symptoms may involve the digestive system.",
    },
    Pulmonology: {
      icon: <Activity className="h-8 w-8 text-sky-500" />,
      description:
        "Your symptoms may involve the lungs or respiratory system.",
    },
  };

  const config = specialtyConfig[specialty];

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-white p-3 shadow-sm">
          {config?.icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            Suggested Specialty
          </h3>

          <p className="text-lg font-semibold text-blue-700">
            {specialty}
          </p>

          <p className="text-gray-600">
            {config?.description}
          </p>

          <p className="text-sm text-gray-500">
            This recommendation is based on the symptoms you described and is
            intended to help you choose the most appropriate doctor.
          </p>
        </div>
      </div>
    </div>
  );
}