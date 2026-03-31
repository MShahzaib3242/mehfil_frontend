import React from "react";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../socket";
import { useChat } from "../../context/ChatContext";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../api/messageApi";

export const useChatMessages = (activeChat: any) => {
  const { user } = useAuth();
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["chatMessages", activeChat?._id],
    queryFn: () => getMessages(activeChat?._id),
    enabled: !!activeChat,
  });
  const { openChat, incrementUnread, isMinimized, mode, isOpen } = useChat();

  const [messages, setMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMessages(history);
  }, [history]);

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
        if (isMinimized || activeChat?._id !== senderId) {
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

  return { messages, isLoading };
};
