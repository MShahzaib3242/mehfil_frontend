import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../../api/postApi";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      const previous = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData(["feed"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          posts: old.posts.map((post: any) => {
            if (post._id === postId) {
              const alreadyLiked = post.isLiked;

              return {
                ...post,
                isLiked: !alreadyLiked,
                likesCount: alreadyLiked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
              };
            }
            return post;
          }),
        };
      });

      return { previous };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["feed"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
