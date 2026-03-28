import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { socket } from "../../socket";

export const useActiveUsersRealtime = () => {
  const queryClient = useQueryClient();
  React.useEffect(() => {
    socket.on("activeUsersUpdate", (onlineUserIds: string[]) => {
      queryClient.setQueryData(["activeUsers"], (old: any) => {
        if (!old) return old;

        return old.map((user: any) => ({
          ...user,
          isOnline: onlineUserIds.includes(user._id),
        }));
      });
    });

    return () => {
      socket.off("activeUsersUpdate");
    };
  }, []);
};
