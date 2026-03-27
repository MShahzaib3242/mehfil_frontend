import React from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PasswordUpdatedModal() {
  const navigate = useNavigate();
  const { passwordUpdated, logout } = useAuth();

  if (!passwordUpdated) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-6 w-[350px] text-center"
      >
        <h2 className="text-lg font-semibold mb-3">Password Updated</h2>

        <p className="text-sm text-gray-500 mb-6">
          Your password has been updated. Please login again.
        </p>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full bg-red-500 text-white py-2 rounded-md"
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
}

export default PasswordUpdatedModal;
