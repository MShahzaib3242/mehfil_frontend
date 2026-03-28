import { useQuery } from "@tanstack/react-query";
import { getActiveUsers } from "../../api/Auth/userApi";

export const useActiveUsers = () => {
  return useQuery({
    queryKey: ["activeUsers"],
    queryFn: getActiveUsers,
    staleTime: 1000 * 60 * 5, // 5 min
    refetchOnWindowFocus: false, //every 10s
  });
};
