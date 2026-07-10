export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  experience: number;
};

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Ahmad Khalil",
    specialty: "Cardiology",
    experience: 12,
  },
  {
    id: 2,
    name: "Dr. Sarah Nader",
    specialty: "Cardiology",
    experience: 8,
  },
  {
    id: 3,
    name: "Dr. Maya Hassan",
    specialty: "Neurology",
    experience: 10,
  },
  {
    id: 4,
    name: "Dr. Jad Ibrahim",
    specialty: "Orthopedics",
    experience: 15,
  },
  {
    id: 5,
    name: "Dr. Nour Ali",
    specialty: "Dermatology",
    experience: 7,
  },
  {
    id: 6,
    name: "Dr. Karim Saleh",
    specialty: "ENT",
    experience: 9,
  },
  {
    id: 7,
    name: "Dr. Rana Youssef",
    specialty: "Ophthalmology",
    experience: 11,
  },
  {
    id: 8,
    name: "Dr. Elie Haddad",
    specialty: "Pulmonology",
    experience: 14,
  },
];