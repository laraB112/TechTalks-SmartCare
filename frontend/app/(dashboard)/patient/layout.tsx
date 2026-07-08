import { ReactNode } from "react";
import DashboardLayout from "../components/DashboardLayout";

type LayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({
  children,
}: LayoutProps) {
  return (
    <DashboardLayout role="patient">
      {children}
    </DashboardLayout>
  );
}