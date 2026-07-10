export type Specialty = {
  name: string;
  keywords: string[];
};

export const specialties: Specialty[] = [
  {
    name: "Cardiology",
    keywords: [
      "heart",
      "heartbeat",
      "chest",
      "palpitations",
      "pulse",
      "blood pressure",
      "cardiac",
      "arrhythmia",
    ],
  },
  {
    name: "Neurology",
    keywords: [
      "headache",
      "migraine",
      "brain",
      "memory",
      "seizure",
      "stroke",
      "dizziness",
      "numbness",
      "tingling",
    ],
  },
  {
    name: "Dermatology",
    keywords: [
      "skin",
      "rash",
      "itch",
      "itching",
      "acne",
      "eczema",
      "mole",
      "red spots",
      "allergy",
    ],
  },
  {
    name: "Orthopedics",
    keywords: [
      "bone",
      "bones",
      "joint",
      "knee",
      "back",
      "shoulder",
      "ankle",
      "hip",
      "fracture",
    ],
  },
  {
    name: "ENT",
    keywords: [
      "ear",
      "ears",
      "nose",
      "throat",
      "sinus",
      "tonsil",
      "hearing",
      "voice",
    ],
  },
  {
    name: "Ophthalmology",
    keywords: [
      "eye",
      "eyes",
      "vision",
      "blur",
      "blurry",
      "blind",
      "red eye",
    ],
  },
  {
    name: "Gastroenterology",
    keywords: [
      "stomach",
      "abdomen",
      "abdominal",
      "vomit",
      "vomiting",
      "diarrhea",
      "constipation",
      "ulcer",
      "liver",
      "nausea",
    ],
  },
  {
    name: "Pulmonology",
    keywords: [
      "lung",
      "lungs",
      "breathing",
      "cough",
      "asthma",
      "shortness of breath",
      "wheezing",
    ],
  },
];