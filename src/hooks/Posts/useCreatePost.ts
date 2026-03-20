import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/postApi";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      const previous = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData(["feed"], (old: any) => ({
        ...old,
        posts: [
          {
            _id: Date.now(),
            content: newPost.content,
            image: newPost.image,
            author: {
              name: "You",
              avatar: "https://i.pravatar.cc/150",
            },
          },
          ...(old?.posts || []),
        ],
      }));

      return { previous };
    },

    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(["feed"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
