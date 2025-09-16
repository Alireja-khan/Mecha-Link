import { Home, User, CreditCard, Settings, LogOut } from "lucide-react"; // modern icons
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { name: "Overview", icon: <Home size={20} />, href: "/dashboard" },
    { name: "Profile", icon: <User size={20} />, href: "/dashboard/user/profile" },
    { name: "Payments", icon: <CreditCard size={20} />, href: "/dashboard/user/payments" },
    { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/user/settings" },
  ];

  return (
    <aside className="h-screen w-64 border-r border-gray-200 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-gray-200">
        MechaLink
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-600 transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
