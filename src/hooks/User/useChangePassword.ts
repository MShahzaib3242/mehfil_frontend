import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/Auth/userApi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export const useChangePassword = () => {
  const { setPasswordUpdated } = useAuth();

  return useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      toast.success("Password updated successfully.");

      setPasswordUpdated(true);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data.message || "Failed to update password");
    },
  });
};
