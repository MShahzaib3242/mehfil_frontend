import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsRead, markAsRead } from "../../api/notificationApi";

export const useMarkNotification = () => {
  const queryClient = useQueryClient();

  const markOne = useMutation({
    mutationFn: markAsRead,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;

        return old.map((n: any) => (n._id === id ? { ...n, read: true } : n));
      });

      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["notifications"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAll = useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previous = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;

        return old.map((n: any) => ({
          ...n,
          read: true,
        }));
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["notifications"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { markOne, markAll };
};
