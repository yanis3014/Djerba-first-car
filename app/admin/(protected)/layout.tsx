import { AdminShell } from "@/components/admin/AdminSidebar";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { getAdminNotificationCounts } from "@/lib/admin/notification-counts";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const counts = await getAdminNotificationCounts();

  return (
    <div className="h-screen overflow-hidden">
      <AdminShell newLeads={counts.newLeads} unreadMessages={counts.unreadMessages}>
        {children}
      </AdminShell>
      <AdminToaster />
    </div>
  );
}
