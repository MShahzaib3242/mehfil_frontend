import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../../api/postApi";
import { ol } from "framer-motion/client";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries();

      const previousFeed = queryClient.getQueryData(["feed"]);
      const previousUserPosts = queryClient.getQueriesData({
        queryKey: ["userPosts"],
      });

      queryClient.setQueryData(["feed"], (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) => {
            if (post._id === postId) {
              const isLiked = !post.isLiked;
              return {
                ...post,
                isLiked,
                likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
              };
            }
            return post;
          }),
        };
      });

      previousUserPosts.forEach(([key]) => {
        queryClient.setQueryData(key, (old: any) => {
          if (!old) return old;

          return old.map((post: any) => {
            if (post._id === postId) {
              const isLiked = !post.isLiked;
              return {
                ...post,
                isLiked,
                likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
              };
            }
            return post;
          });
        });
      });

      return { previousFeed, previousUserPosts };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["feed"], context?.previousFeed);

      context?.previousUserPosts.forEach(({ key, data }: any) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
};
