import { isAuthenticated } from "@/lib/auth";
import { SideNavBar } from "@/components/layout/side-nav";
import { ToastProvider } from "@/components/ui/toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  return (
    <div className="min-h-screen flex">
      {authenticated && <SideNavBar />}
      <main
        id="main-content"
        className={`flex-1 w-full max-w-5xl mx-auto overflow-y-auto ${
          authenticated
            ? "ml-0 md:ml-64 p-6 md:p-8 pt-8 pb-24 md:pb-8"
            : ""
        }`}
      >
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
