import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, updatePost } from "../../api/postApi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, deletedPostId) => {
      toast.success("Post removed successfully");

      // update profile posts
      queryClient.setQueryData(["userPosts", user?._id], (old: any) => ({
        ...old,
        posts: old?.posts?.filter((p: any) => p._id !== deletedPostId),
      }));

      // update feed posts
      queryClient.setQueryData(["feed"], (old: any) => ({
        ...old,
        posts: old?.posts?.filter((p: any) => p._id !== deletedPostId),
      }));
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
