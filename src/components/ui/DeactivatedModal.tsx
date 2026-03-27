import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function DeactivatedModal() {
  const { isDeactivated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isDeactivated) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-6 w-[350px] text-center"
      >
        <h2 className="text-lg font-semibold mb-3">Account Deactivated</h2>
        <p className="text-sm text-gray-500 mb-6">
          Your account is deactivated. Contact support to reactivate your
          account.
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

export default DeactivatedModal;
