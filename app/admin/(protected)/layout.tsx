import { AdminShell } from "@/components/admin/AdminSidebar";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="h-screen overflow-hidden">
      <AdminShell>{children}</AdminShell>
      <AdminToaster />
    </div>
  );
}
