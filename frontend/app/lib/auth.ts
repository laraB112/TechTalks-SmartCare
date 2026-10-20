
export type User = {
  id: number;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
};

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken() && getUser());
}

export function logout(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
