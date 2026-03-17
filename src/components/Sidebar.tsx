import { motion } from "framer-motion";
import { Bell, Compass, Home, LogOut, SquarePen, User } from "lucide-react";
import React from "react";

function Sidebar() {
  const user = {
    name: "Shahzaib Chand",
    username: "shahzaib077",
    email: "m.shahzaib3242@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=5",
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Logo  */}
        <h1 className="text-2xl font-bold mb-8 text-mehfil-primary">Mehfil</h1>

        {/* Navigation  */}
        <nav className="space-y-1">
          <NavItem icon={<Home size={18} />} label="Home" />
          <NavItem icon={<Compass size={18} />} label="Explore" />
          <NavItem icon={<Bell size={18} />} label="Notifications" />
          <NavItem icon={<User size={18} />} label="Profile" />
        </nav>
      </div>

      {/* Profile Section  */}
      <div className="border-t pt-4">
        <div className="flex gap-3 items-center mb-3">
          <img
            src={user.avatar}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-sm">
            <div className="font-semibold">{user.name}</div>
            <div className="text-gray-500 text-xs">@{user.username}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-3">{user.email}</div>
        <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
};

function NavItem({ icon, label }: NavItemProps) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition text-sm"
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  );
}

export default Sidebar;
