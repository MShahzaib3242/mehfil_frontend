import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blockUser, unblockUser } from "../../api/blockApi";
import toast from "react-hot-toast";

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isBlocked }: any) =>
      isBlocked ? unblockUser(userId) : blockUser(userId),

    onSuccess: (_, { userId, isBlocked }) => {
      toast.success(isBlocked ? "Unblocked" : "User Blocked ");

      queryClient.setQueryData(["userProfile", userId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          isBlocked: !isBlocked,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
