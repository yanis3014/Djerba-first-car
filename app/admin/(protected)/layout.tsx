import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="min-h-screen flex-1 overflow-x-auto border-l border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
