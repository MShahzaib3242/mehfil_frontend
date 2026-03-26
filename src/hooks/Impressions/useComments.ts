import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../../api/commentApi";

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await getPostComments(postId);
      return res.comments || res || [];
    },
    enabled: !!postId,
  });
};
