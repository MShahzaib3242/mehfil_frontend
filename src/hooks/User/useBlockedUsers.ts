import { useQuery } from "@tanstack/react-query";
import { getBlockedUsers } from "../../api/blockApi";

export const useBlockedUsers = () => {
  return useQuery({
    queryKey: ["blockedUsers"],
    queryFn: async () => {
      const res = await getBlockedUsers();
      return res.data.users;
    },
  });
};
