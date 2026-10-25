export type Specialty = {
  name: string;
  keywords: string[];
  icon: string;
};

export const specialties: Specialty[] = [
  {
    name: "Cardiology",
    icon: "/images/cardiology.png",
    keywords: [
      "heart", "heartbeat", "chest", "palpitations", "pulse",
      "blood pressure", "cardiac", "arrhythmia",
    ],
  },
  {
    name: "Neurology",
    icon: "/images/neurons.png",
    keywords: [
      "headache", "migraine", "brain", "memory", "seizure",
      "stroke", "dizziness","dizzy", "numbness", "tingling",
    ],
  },
  {
    name: "Dermatology",
    icon: "/images/beauty.png",
    keywords: [
      "skin", "rash", "itch", "itching", "acne", "eczema",
      "mole", "red spots", "allergy","itchy","spots",
    ],
  },
  {
    name: "Orthopedics",
    icon: "/images/bone (1).png",
    keywords: [
      "bone", "bones", "joint", "knee", "back", "shoulder",
      "ankle", "hip", "fracture",
    ],
  },
  {
    name: "ENT",
    icon: "/images/nasal.png",
    keywords: [
      "ear", "ears", "nose", "throat", "sinus", "tonsil",
      "hearing", "voice",
    ],
  },
  {
    name: "Ophthalmology",
    icon: "/images/eye.png",
    keywords: [
      "eye", "eyes", "vision", "blur", "blurry", "blind",
      "red eye","dry eyes",
    ],
  },
  {
    name: "Gastroenterology",
    icon: "/images/intestine.png",
    keywords: [
      "stomach", "abdomen", "abdominal", "vomit", "vomiting",
      "diarrhea", "constipation", "ulcer", "liver", "nausea",
    ],
  },
  {
    name: "Pulmonology",
    icon: "/images/health (1).png",
    keywords: [
      "lung", "lungs", "breathing", "cough", "asthma",
      "shortness of breath", "wheezing",
    ],
  },
];
