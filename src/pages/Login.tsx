import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { motion } from "framer-motion";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { p } from "framer-motion/client";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/toastError";
import Loader from "../components/ui/Loader";
import { getCurrentUser } from "../api/Auth/userApi";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

function Login() {
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending } = useLogin();

  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: async (res) => {
        login(res.token);

        try {
          const userData = await getCurrentUser();

          setUser(userData);

          navigate("/");
        } catch (err) {
          toast.error("Failed to load user");
        }
      },
      onError: (error: any) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Left Panel  */}
      <div className="relative flex flex-col justify-center px-20 text-white bg-gradient-to-br from-indigo-600 to-purple-700 ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-6">Mehfil</h1>

          <p className="text-lg opacity-90 mb-10 max-w-md">
            Where stories come alive. Share ideas, connect with people, and
            build meaningful discussion.
          </p>

          <div className="space-y-4 text-sm opacity-90">
            <div>✨ Share thoughts with the community</div>
            <div>💬 Engage in meaningful discussions</div>
            <div>🌍 Discover voices from around the world</div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel  */}
      <div className="flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/80 border shadow-xl rounded-2xl p-10 w-96"
        >
          <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email  */}
            <div className="mb-4">
              <input
                {...register("email")}
                placeholder="Email Address"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition
                    ${errors.email ? "border-red-400 focus:ring-red-400" : "focus:ring-2 focus:ring-mehfil-primaryf"}
                    `}
              />

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password  */}
            <div className="mb-5">
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition
                            ${errors.password ? "border-red-400 focus:ring-red-400" : "focus:ring-2 focus:ring-mehfil-primary"}
                        `}
              />

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={isPending}
              className="w-full py-2 rounded-lg bg-mehfil-primary text-white font-medium hover:opacity-90 transition flex items-center justify-center"
            >
              {isPending ? <Loader /> : "Login"}
            </button>

            <p className="text-sm text-gray-500 mt-6 text-center">
              Don't have an account?{" "}
              <span
                className="text-mehfil-primary ml-1 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign up
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
