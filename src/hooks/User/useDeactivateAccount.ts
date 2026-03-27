import { useMutation } from "@tanstack/react-query";
import { deactivateAccount } from "../../api/Auth/userApi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export const useDeactivateAccount = () => {
  const { setIsDeactivated } = useAuth();

  return useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => {
      toast.success("Account Deactivated");

      setIsDeactivated(true);
    },
  });
};
