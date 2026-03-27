import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

export const useFollowers = (userId: string) => {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: async () => {
      const res = await api.get(`/follow/${userId}/followers`);
      return res.data.followers;
    },
    enabled: !!userId,
  });
};
