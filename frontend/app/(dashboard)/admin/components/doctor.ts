 export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  phone: string;
  isAvailable: boolean;
}


 export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    email: "john.smith@smartcare.com",
    specialty: "Cardiology",
    experience: 12,
    phone: "+961 71 123 456",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@smartcare.com",
    specialty: "Neurology",
    experience: 9,
    phone: "+961 70 456 789",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    email: "michael.brown@smartcare.com",
    specialty: "Dermatology",
    experience: 15,
    phone: "+961 03 789 123",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Dr. Emily Davis",
    email: "emily.davis@smartcare.com",
    specialty: "Pediatrics",
    experience: 7,
    phone: "+961 81 654 321",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Dr. David Wilson",
    email: "david.wilson@smartcare.com",
    specialty: "Orthopedics",
    experience: 18,
    phone: "+961 76 987 654",
    isAvailable: true,
  },
  {
    id: 6,
    name: "Dr. Olivia Martinez",
    email: "olivia.martinez@smartcare.com",
    specialty: "Ophthalmology",
    experience: 11,
    phone: "+961 79 555 444",
    isAvailable: true,
  },
  {
    id: 7,
    name: "Dr. Daniel Lee",
    email: "daniel.lee@smartcare.com",
    specialty: "ENT",
    experience: 13,
    phone: "+961 70 888 222",
    isAvailable: true,
  },
  {
    id: 8,
    name: "Dr. Sophia Anderson",
    email: "sophia.anderson@smartcare.com",
    specialty: "Psychiatry",
    experience: 10,
    phone: "+961 71 444 999",
    isAvailable: false,
  },
];