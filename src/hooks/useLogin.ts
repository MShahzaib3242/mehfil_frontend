import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/Auth/authApi";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
