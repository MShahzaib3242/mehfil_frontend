import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../api/Auth/userApi";

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
};
