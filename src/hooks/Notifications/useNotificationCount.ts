import { useQueryClient } from "@tanstack/react-query";

export const useNotificationCount = () => {
  const queryClient = useQueryClient();

  const data = (queryClient.getQueryData(["notifications"]) as any[]) || [];

  return data.filter((n: any) => !n.read).length;
};
