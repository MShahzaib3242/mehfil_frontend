import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";
import { followUser, unfollowUser } from "../../api/followApi";

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isFollowing,
    }: {
      userId: string;
      isFollowing: boolean;
    }) => {
      if (isFollowing) {
        return unfollowUser(userId);
      }
      return followUser(userId);
    },

    onMutate: async ({ userId, isFollowing }) => {
      await queryClient.cancelQueries({ queryKey: ["suggestedUsers"] });

      const previous = queryClient.getQueryData(["suggestedUsers"]);

      queryClient.setQueryData(["suggestedUsers"], (old: any) => {
        if (!old) return old;

        return old.map((user: any) => {
          if (user._id === userId) {
            return {
              ...user,
              isFollowing: !isFollowing,
            };
          }
          return user;
        });
      });
      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["suggestedUsers"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
