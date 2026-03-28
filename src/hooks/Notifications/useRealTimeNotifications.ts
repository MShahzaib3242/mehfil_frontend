import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { socket } from "../../socket";
import toast from "react-hot-toast";

export const useRealTimeNotifications = () => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const handler = (data: any) => {
      console.log("Notification received:", data);

      toast.success(getMessage(data));
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return [data];
        return [data, ...old];
      });
    };
    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [queryClient]);
};

const getMessage = (n: any) => {
  if (n.type === "follow") return `${n.sender.name} followed you`;
  if (n.type === "like") return `${n.sender.name} liked your post`;
  if (n.type === "comment") return `${n.sender.name} commented on your post`;
  if (n.type === "commentLike") return `${n.sender.name} likes your comment`;
  return "New notification";
};
