import { motion } from "framer-motion";
import {
  Bell,
  Compass,
  Home,
  Mail,
  Menu,
  MessageCircle,
  User,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useNotificationCount } from "../hooks/Notifications/useNotificationCount";
import { useChat } from "../context/ChatContext";

function Sidebar() {
  // const { user, logout } = useAuth();
  const navigate = useNavigate();
  const count = useNotificationCount();
  const { totalUnreadConversations } = useChat();

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex flex-col gap-4 p-4 ${collapsed ? "items-center" : "items-start"}`}
      >
        <div
          className={`flex items-center w-full ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {/* Logo  */}
          {!collapsed && (
            <h1 className="text-2xl font-bold text-black text-center uppercase">
              {/* Mehfil */}
              motifino
            </h1>
          )}
          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation  */}
        <nav className="flex flex-col gap-2 w-full">
          <NavItem
            icon={<Home size={18} />}
            label="Home"
            route="/"
            collapsed={collapsed}
          />
          <NavItem
            icon={
              <div className="relative">
                <Bell size={18} />
                {count > 0 && (
                  <span className="absolute -top-1 right-0 bg-red-500 w-2 h-2 rounded-full" />
                )}
              </div>
            }
            label="Notifications"
            route="/notifications"
            collapsed={collapsed}
          />
          <div className="relative">
            <NavItem
              icon={<MessageCircle size={18} />}
              label="Inbox"
              route="/inbox"
              collapsed={collapsed}
            />
            {totalUnreadConversations > 0 && (
              <span className="absolute top-1/3 right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalUnreadConversations}
              </span>
            )}
          </div>
          <NavItem
            icon={<Compass size={18} />}
            label="Explore"
            route="/explore"
            collapsed={collapsed}
          />

          <NavItem
            icon={<User size={18} />}
            label="Profile"
            route="/profile"
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* Profile Section  */}
      <div className="mt-auto border-t p-4 flex items-center justify-between">
        <ProfileDropdown collapsed={collapsed} />
      </div>
    </div>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  route: string;
  collapsed: boolean;
};

function NavItem({ icon, label, route, collapsed }: NavItemProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition text-sm"
      onClick={() => navigate(route)}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </motion.div>
  );
}

export default Sidebar;
