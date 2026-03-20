import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../api/Auth/userApi";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};
