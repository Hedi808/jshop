import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div dir="ltr" className="min-h-screen bg-[#f5f5f5]"><AdminNav /><main className="lg:ml-64">{children}</main></div>;
}
