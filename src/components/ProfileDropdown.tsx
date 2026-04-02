import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { dummyImage } from "../utils/constants";

type ProfileDropDown = {
  collapsed: boolean;
};

function ProfileDropdown({ collapsed }: ProfileDropDown) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleclickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleclickOutside);
    return () => document.removeEventListener("mousedown", handleclickOutside);
  }, []);

  console.log("collapsed", collapsed);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar  */}

      <div
        className="flex gap-3 items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <img
          src={user?.avatar || dummyImage}
          className="w-10 h-10 rounded-full"
        />
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-xs">@{user?.username}</p>
          </div>
        )}
      </div>

      {/* Dropdown  */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 bottom-10 mt-2 w-56 bg-white border rounded-xl shadow-lg p-3 z-50"
          >
            {/* User Info  */}
            <div className="border-b pb-2 mb-2">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>

            {/* Actions  */}
            <button
              className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded-md"
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
            >
              Profile
            </button>

            <button
              onClick={() => {
                navigate("/security");
                setOpen(false);
              }}
              className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded-md"
            >
              Security
            </button>

            <button
              className="w-full text-left p-2 text-sm text-red-500 hover:bg-red-50 rounded-md"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileDropdown;
