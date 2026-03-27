import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

export const useFollowing = (userId: string) => {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: async () => {
      const res = await api.get(`/follow/${userId}/following`);
      return res.data.following;
    },
    enabled: !!userId,
  });
};
