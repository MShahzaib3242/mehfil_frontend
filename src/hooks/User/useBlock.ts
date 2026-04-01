import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blockUser, unblockUser } from "../../api/blockApi";
import toast from "react-hot-toast";

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      isBlocked,
    }: {
      userId: string;
      isBlocked: boolean;
    }) => {
      return isBlocked ? unblockUser(userId) : blockUser(userId);
    },

    onSuccess: (_data, vars) => {
      if (vars.isBlocked) {
        toast.success("User Unblocked");
      } else {
        toast.success("User Blocked");
      }
    },

    onMutate: async ({ userId, isBlocked }) => {
      await queryClient.cancelQueries({ queryKey: ["userProfile", userId] });

      const previous = queryClient.getQueryData(["userProfile", userId]);

      queryClient.setQueryData(["userProfile", userId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          isBlocked: !isBlocked,
          isFollowing: false,
        };
      });

      return { previous };
    },

    onError: (_err, vars, context) => {
      queryClient.setQueryData(["userProfile", vars.userId], context?.previous);
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", vars.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
};
