import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../api/commentApi";
import toast from "react-hot-toast";

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: any) => createComment(postId, content),
    onSuccess: (newComment, { postId }) => {
      if (!newComment) return;

      queryClient.setQueryData(["comments", postId], (old: any) => {
        const existing = Array.isArray(old) ? old : old?.comment || [];

        return [newComment, ...existing];
      });

      queryClient.setQueryData(["feed"], (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((p: any) =>
            p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p,
          ),
        };
      });
      toast.success("Comment Added 💬");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });
};
