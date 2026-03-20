import { motion } from "framer-motion";
import { Bell, Compass, Home, LogOut, SquarePen, User } from "lucide-react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

function Sidebar() {
  // const user = {
  //   name: "Shahzaib Chand",
  //   username: "shahzaib077",
  //   email: "m.shahzaib3242@gmail.com",
  //   avatar: "https://i.pravatar.cc/150?img=5",
  // };

  // const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col gap-4 p-4">
        {/* Logo  */}
        <h1 className="text-2xl font-bold text-mehfil-primary text-center">
          Mehfil
        </h1>

        {/* Navigation  */}
        <nav className="flex flex-col gap-2">
          <NavItem icon={<Home size={18} />} label="Home" />
          <NavItem icon={<Compass size={18} />} label="Explore" />
          <NavItem icon={<Bell size={18} />} label="Notifications" />
          <NavItem icon={<User size={18} />} label="Profile" />
        </nav>
      </div>

      {/* Profile Section  */}
      <div className="mt-auto border-t p-4 flex items-center justify-between">
        <ProfileDropdown />
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
