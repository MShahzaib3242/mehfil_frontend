import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveUsers } from "../../api/Auth/userApi";
import React from "react";
import { socket } from "../../socket";

export const useActiveUsers = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["activeUsers"],
    queryFn: getActiveUsers,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    const handleActiveUsers = (onlineUserIds: string[]) => {
      queryClient.setQueryData(["activeUsers"], (old: any) => {
        if (!old) return old;

        return old.map((u: any) => ({
          ...u,
          isOnline: onlineUserIds.includes(u._id),
        }));
      });
    };

    socket.on("activeUsersUpdate", handleActiveUsers);

    return () => {
      socket.off("activeUsersUpdate", handleActiveUsers);
    };
  }, [queryClient]);

  React.useEffect(() => {
    const handleLastSeen = ({ userId, lastSeen }: any) => {
      queryClient.setQueryData(["activeUsers"], (old: any) => {
        if (!old) return old;

        return old.map((u: any) =>
          u._id === userId ? { ...u, isOnline: false, lastSeen } : u,
        );
      });
    };

    socket.on("userLastSeen", handleLastSeen);

    return () => {
      socket.off("userLastSeen", handleLastSeen);
    };
  }, [queryClient]);

  // return useQuery({
  //   queryKey: ["activeUsers"],
  //   queryFn: getActiveUsers,
  //   staleTime: 1000 * 60 * 5, // 5 min
  //   refetchOnWindowFocus: false, //every 10s
  // });
  return query;
};
