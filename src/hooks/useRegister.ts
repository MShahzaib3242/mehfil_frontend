import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/Auth/authApi";

const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export default useRegister;
