import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "../../api/messageApi";
import { useChat } from "../../context/ChatContext";

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const { closeChat } = useChat();

  return useMutation({
    mutationFn: deleteConversation,

    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });

      const previous = queryClient.getQueryData(["conversations"]);

      queryClient.setQueryData(["conversations"], (old: any) => {
        old?.filter((c: any) => c.user._id !== userId);
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["conversations"], context?.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["chatMessages"],
        exact: false,
      });

      closeChat();
    },
  });
};
