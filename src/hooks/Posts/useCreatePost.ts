import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/postApi";
import { useAuth } from "../../context/AuthContext";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: FormData) => createPost(data),

    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      const previous = queryClient.getQueryData(["feed"]);

      const content = formData.get("content") as string;

      const imageFiles = formData.getAll("images") as File[];
      const previewImages = imageFiles.map((file) => URL.createObjectURL(file));

      queryClient.setQueryData(["feed"], (old: any) => ({
        ...old,
        posts: [
          {
            _id: Date.now(),
            content,
            images: previewImages,
            author: {
              name: user?.name || "You",
              avatar: user?.avatar,
            },
            isOptimistic: true,
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
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
};
