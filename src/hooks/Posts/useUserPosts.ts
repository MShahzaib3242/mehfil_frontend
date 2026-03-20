import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../api/postApi";

export const useUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPosts(userId!),
    enabled: !!userId,
  });
};
