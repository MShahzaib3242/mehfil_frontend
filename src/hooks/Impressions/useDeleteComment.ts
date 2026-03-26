import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../api/commentApi";
import toast from "react-hot-toast";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, postId }: any) => deleteComment(commentId),

    onSuccess: (_, { commentId, postId }: any) => {
      queryClient.setQueryData(["comments", postId], (old: any) => {
        const list = Array.isArray(old) ? old : old?.comments || [];

        return list.filter((c: any) => c._id !== commentId);
      });

      queryClient.setQueryData(["feed"], (old: any) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map((p: any) =>
            p._id === postId ? { ...p, commentsCount: p.commentsCount - 1 } : p,
          ),
        };
      });
      toast.success("Comment Deleted 💬");
    },
    onError: () => {
      toast.error("Failed to delete Comment");
    },
  });
};
