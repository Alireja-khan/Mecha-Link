import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar className="sticky top-0" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar className="sticky top-0 z-10 shadow-sm" />
          <div className="flex-1 overflow-auto p-4 bg-gray-50">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
