import { motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import React from "react";

type Props = {
  placeholder: string;
  register: any;
  error?: string;
  type?: string;
  status?: {
    loading?: boolean;
    available?: boolean;
    message?: string;
  };
};

function Input({ placeholder, register, error, type = "text", status }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          {...register}
          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition ${
            error ? "border-red-400" : "focus:ring-2 focus:ring-mehfil-primary"
          }`}
        />
        {/* STATUS ICON  */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {/* USERNAME CHECK  */}
          {status?.loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 size={18} className="text-gray-400" />
            </motion.div>
          )}

          {status?.available === true && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle size={18} className="text-green-500" />
            </motion.div>
          )}

          {status?.available == false && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <XCircle size={18} className="text-red-500" />
            </motion.div>
          )}

          {/* PASSWORD TOGGLE  */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
      {status?.available === true && (
        <p className="text-green-500 text-xs mt-1">{status?.message}</p>
      )}

      {status?.available == false && (
        <p className="text-red-500 text-xs mt-1">{status?.message}</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default Input;
