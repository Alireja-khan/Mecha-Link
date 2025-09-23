import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar: sticky to left */}
      <Sidebar className="sticky top-0" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar: sticky to top */}
        <Topbar className="sticky top-0 z-10 shadow-sm" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}


