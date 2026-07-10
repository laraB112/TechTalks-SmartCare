import { ReactNode } from "react";
import DashboardLayout from "../components/DashboardLayout";

type LayoutProps = {
  children: ReactNode;
};

export default function DoctorLayout({
  children,
}: LayoutProps) {
  return (
    <DashboardLayout role="doctor">
      {children}
    </DashboardLayout>
  );
}