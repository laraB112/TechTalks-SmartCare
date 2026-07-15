export type AppointmentStatus = "Waiting" | "Pending" | "Completed";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  patientName: string;
  phone: string;
  age: number;
  gender: "Male" | "Female";
  issue: string;
  status: AppointmentStatus;
}

export const appointments: Appointment[] = [
  {
    id: 1,
    date: "2026-07-14",
    time: "09:00 AM",
    patientName: "Sarah Khaled",
    phone: "+961 71 123 456",
    age: 28,
    gender: "Female",
    issue: "Chest pain and shortness of breath",
    status: "Waiting",
  },
  {
    id: 2,
    date: "2026-07-14",
    time: "10:30 AM",
    patientName: "Omar Haddad",
    phone: "+961 70 987 654",
    age: 35,
    gender: "Male",
    issue: "Regular check-up",
    status: "Pending",
  },
  {
    id: 3,
    date: "2026-07-15",
    time: "12:00 PM",
    patientName: "Lina Moussawi",
    phone: "+961 76 555 888",
    age: 42,
    gender: "Female",
    issue: "Follow-up visit",
    status: "Pending",
  },
  {
    id: 4,
    date: "2026-07-14",
    time: "02:00 PM",
    patientName: "George Abdallah",
    phone: "+961 03 222 111",
    age: 60,
    gender: "Male",
    issue: "Blood pressure management",
    status: "Completed",
  },
];