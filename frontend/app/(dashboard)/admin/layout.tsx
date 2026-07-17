import { ReactNode } from "react";
import DashboardLayout from "../components/DashboardLayout";

type LayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: LayoutProps) {
  return (
    <DashboardLayout role="admin">
      {children}
    </DashboardLayout>
  );
}