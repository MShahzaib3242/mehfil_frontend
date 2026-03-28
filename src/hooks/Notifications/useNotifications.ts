import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../api/notificationApi";

export const useNotifications = (options?: { enabled?: boolean }) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: !!token && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
