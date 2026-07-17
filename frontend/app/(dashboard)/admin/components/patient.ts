export interface Patient {
  id: number;
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
}

export const patients: Patient[] = [
  {
    id: 1,
    fullName: "Ahmed Khalil",
    email: "ahmed.khalil@example.com",
    password: "Password123",
    age: 27,
    gender: "Male",
    phone: "+961 71 123 456",
  },
  {
    id: 2,
    fullName: "Maya Haddad",
    email: "maya.haddad@example.com",
    password: "Password123",
    age: 24,
    gender: "Female",
    phone: "+961 70 456 789",
  },
  {
    id: 3,
    fullName: "Omar Nasser",
    email: "omar.nasser@example.com",
    password: "Password123",
    age: 31,
    gender: "Male",
    phone: "+961 03 789 123",
  },
  {
    id: 4,
    fullName: "Lara Saad",
    email: "lara.saad@example.com",
    password: "Password123",
    age: 22,
    gender: "Female",
    phone: "+961 81 654 321",
  },
  {
    id: 5,
    fullName: "Karim Hamdan",
    email: "karim.hamdan@example.com",
    password: "Password123",
    age: 29,
    gender: "Male",
    phone: "+961 76 987 654",
  },
  {
    id: 6,
    fullName: "Rita George",
    email: "rita.george@example.com",
    password: "Password123",
    age: 35,
    gender: "Female",
    phone: "+961 79 555 444",
  },
  {
    id: 7,
    fullName: "Ali Mansour",
    email: "ali.mansour@example.com",
    password: "Password123",
    age: 26,
    gender: "Male",
    phone: "+961 70 888 222",
  },
  {
    id: 8,
    fullName: "Nour Chahine",
    email: "nour.chahine@example.com",
    password: "Password123",
    age: 28,
    gender: "Female",
    phone: "+961 71 444 999",
  },
];