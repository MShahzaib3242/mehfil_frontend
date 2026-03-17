import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/Auth/userApi";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};
