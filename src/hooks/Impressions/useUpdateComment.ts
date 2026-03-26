import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../api/commentApi";
import toast from "react-hot-toast";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: any) =>
      updateComment(commentId, content),

    onSuccess: (updatedComment, variables: any) => {
      const { postId } = variables;

      queryClient.setQueryData(["comments", postId], (old: any) => {
        const list = Array.isArray(old) ? old : old?.comments || [];

        return list.map((c: any) =>
          c._id === updatedComment._id
            ? {
                ...c,
                ...updateComment,
                author: c.author || updatedComment.author,
              }
            : c,
        );
      });
      toast.success("Comment Updated 💬");
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });
};
