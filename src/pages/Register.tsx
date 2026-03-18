import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import z from "zod";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/toastError";
import { motion } from "framer-motion";

import useRegister from "../hooks/useRegister";
import Loader from "../components/ui/Loader";
import { useCheckUsername } from "../hooks/useCheckUsername";
import Input from "../components/ui/Input";
import { getCurrentUser } from "../api/Auth/userApi";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function Register() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { mutate, isPending } = useRegister();
  const { status, debouncedCheck } = useCheckUsername();
  const { login } = useAuth();

  const [strength, setStrength] = React.useState(0);

  if (user) {
    return <Navigate to="/login" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const calculateStrength = (password: string) => {
    let score = 0;
    if (password.length > 5) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  };

  const onSubmit = async (data: FormData) => {
    mutate(
      {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async (res) => {
          //Auto Login
          login(res.token);

          const userData = await getCurrentUser();

          setUser(userData);

          toast.success("Welcome to Mehfil 🎉");
          navigate("/");
        },
        onError: (error: any) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* LEFT PANEL   */}
      <div className="relative flex flex-col justify-center px-20 text-white bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%, rgba(255,255,255,0.2), transparent_40%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-6">Join Mehfil</h1>

          <p className="text-lg opacity-90 mb-10 max-w-md">
            Become part of a thoughtful community. Share ideas, connect with
            minds, and buld meaningful conversations.
          </p>

          <div className="space-y-4 text-sm opacity-90">
            <div>✨ Express your thoughts</div>
            <div>💬 Connect with real people</div>
            <div>🚀 Build your presence</div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL  */}
      <div className="flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/80 border shadow-xl rounded-2xl p-10 w-[420px]"
        >
          <h2 className="text-2xl font-semibold mb-6">Create your account</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* NAME  */}
            <Input
              placeholder="Full Name"
              register={register("name")}
              error={errors.name?.message}
            />

            {/* USERNAME  */}
            <Input
              placeholder="Username"
              register={{
                ...register("username"),
                onChange: (e: any) => {
                  register("username").onChange(e);
                  debouncedCheck(e.target.value);
                  0;
                },
              }}
              error={errors.username?.message}
              status={{
                loading: status.loading,
                available: status.available,
                message: status.message,
              }}
            />

            {/* EMAIL  */}
            <Input
              placeholder="Email"
              register={register("email")}
              error={errors.email?.message}
            />

            {/* PASSWORD  */}
            <Input
              type="password"
              placeholder="Password"
              register={{
                ...register("password"),
                onChange: (e: any) => {
                  register("password").onChange(e);
                  calculateStrength(e.target.value);
                },
              }}
              error={errors.password?.message}
            />
            {/* Strength Bar  */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded ${
                    strength >= level ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* CONFIRM PASSWORD  */}
            <Input
              placeholder="Confirm Password"
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
              type="password"
            />

            {/* BUTTON  */}
            <button
              className="w-full mt-2 py-2 rounded-lg bg-mehfil-primary text-white font-medium hover:opacity-90 transition flex items-center justify-center"
              disabled={isPending}
            >
              {isPending ? <Loader /> : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?
            <span
              className="text-mehfil-primary ml-1 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
