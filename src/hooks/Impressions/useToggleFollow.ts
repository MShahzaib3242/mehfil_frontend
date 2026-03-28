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
      await queryClient.cancelQueries();

      const previousSuggested = queryClient.getQueryData(["suggestedUsers"]);
      const previousFollowers = queryClient.getQueryData(["followers"]);
      const previousFollowings = queryClient.getQueryData(["suggestedUsers"]);

      queryClient.setQueryData(["suggestedUsers"], (old: any) => {
        if (!old) return old;

        return old.map((user: any) =>
          user._id === userId ? { ...user, isFollowing: !isFollowing } : user,
        );
      });

      queryClient.setQueryData(["followers"], (old: any) => {
        if (!old) return old;

        return old.map((u: any) =>
          u._id === userId ? { ...u, isFollowing: !isFollowing } : u,
        );
      });

      queryClient.setQueryData(["following"], (old: any) => {
        if (!old) return old;

        if (isFollowing) {
          return old.filter((u: any) => u._id !== userId);
        } else {
          return old;
        }
      });

      return {
        previousSuggested,
        previousFollowers,
        previousFollowings,
      };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["suggestedUsers"], context?.previousSuggested);
      queryClient.setQueryData(["followers"], context?.previousFollowers);
      queryClient.setQueryData(["following"], context?.previousFollowings);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
