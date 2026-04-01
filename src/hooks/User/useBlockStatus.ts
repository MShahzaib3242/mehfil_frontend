import { useQuery } from "@tanstack/react-query";
import { getBlockStatus } from "../../api/blockApi";

export const useBlockStatus = (userId?: string) => {
  return useQuery({
    queryKey: ["blockStatus", userId],
    queryFn: () => getBlockStatus(userId!),
    enabled: !!userId,
  });
};
