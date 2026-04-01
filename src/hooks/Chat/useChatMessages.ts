import React from "react";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../socket";
import { useChat } from "../../context/ChatContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "../../api/messageApi";

export const useChatMessages = (activeChat: any) => {
  const { user } = useAuth();
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["chatMessages", activeChat?._id],
    queryFn: () => getMessages(activeChat?._id),
    enabled: !!activeChat && !!user,
  });
  const { openChat, incrementUnread, isMinimized, mode, isOpen } = useChat();

  const [messages, setMessages] = React.useState<any[]>([]);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (activeChat?._id) {
      setMessages(history || []);
    }
  }, [history, activeChat]);

  React.useEffect(() => {
    const handleMessage = (msg: any) => {
      const senderId =
        typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      const receiverId = msg.receiver;

      if (
        activeChat &&
        (senderId === activeChat._id || receiverId === activeChat._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }

      if (receiverId === user?._id) {
        // if (isMinimized || activeChat?._id !== senderId) {
        //   incrementUnread(senderId);
        // }
        const isCurrentChatOpen =
          activeChat?._id === senderId && !isMinimized && isOpen;

        if (!isCurrentChatOpen) {
          incrementUnread(senderId);
        }

        if (mode === "floating" && !isOpen) {
          openChat({
            _id: senderId,
            name: msg.sender?.name || "User",
            username: msg.sender?.username || "",
            avatar: msg.sender?.avatar || "",
          });
        }
      }

      queryClient.setQueryData(["conversations"], (old: any) => {
        if (!old) return old;

        const isSenderMe = senderId === user?._id;

        const otherUser = isSenderMe ? activeChat : msg.sender;

        if (!otherUser?._id) return old;

        const index = old.findIndex((c: any) => c.user._id === otherUser._id);

        if (index !== -1) {
          const updated = [...old];
          const item = updated.splice(index, 1)[0];

          item.lastMessage = msg;

          return [item, ...updated];
        }

        return [
          {
            user: otherUser,
            lastMessage: msg,
          },
          ...old,
        ];
      });
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [user, activeChat]);

  React.useEffect(() => {
    if (history.length) {
      setMessages(history);
    }
  }, [history]);

  React.useEffect(() => {
    const handleError = (err: any) => {
      console.log("Message blocked: ", err.message);

      alert(err.message);
    };

    socket.on("messageError", handleError);

    return () => {
      socket.off("messageError", handleError);
    };
  }, []);

  return { messages, isLoading };
};
