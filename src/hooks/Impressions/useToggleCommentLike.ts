import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCommentLike } from "../../api/commentApi";

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(
        ["comments", updatedComment.post],
        (old: any) => {
          if (!old) return old;

          const list = Array.isArray(old) ? old : old.comments || [];

          return list.map((c: any) =>
            c._id === updatedComment._id ? { ...c, ...updatedComment } : c,
          );
        },
      );
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
