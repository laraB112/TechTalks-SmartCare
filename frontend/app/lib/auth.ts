export type User = {
  id: number;
  name: string;
  email: string;
  role: "patient" | "doctor";
};

export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
}


export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}