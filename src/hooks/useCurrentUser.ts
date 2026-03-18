import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/Auth/userApi";

export const useCurrentUser = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });
};
