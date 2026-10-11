import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="drawer md:drawer-open min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <div className="md:hidden fixed top-2 left-2 z-20">
          <label
            htmlFor="my-drawer-4"
            aria-label="Otwórz menu boczne"
            className="btn btn-ghost btn-circle"
          >
            <Menu className="size-5" />
          </label>
        </div>
        <main className="pt-12 md:pt-0 md:pl-64">{children}</main>
      </div>

      <Sidebar />
    </div>
  );
}
