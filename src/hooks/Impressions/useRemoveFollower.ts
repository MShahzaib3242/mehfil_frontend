import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFollower } from "../../api/followApi";
import toast from "react-hot-toast";

export const useRemoveFollower = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFollower,
    onSuccess: (_, followerId) => {
      toast.success("Follower removed");

      queryClient.setQueryData(["followers"], (old: any) => {
        if (!old) return old;
        return old.filter((item: any) => item.follower?._id !== followerId);
      });

      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove follower",
      );
    },
  });
};
