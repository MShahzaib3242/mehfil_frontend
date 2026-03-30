import React from "react";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../socket";
import { useChat } from "../../context/ChatContext";

export const useChatMessages = (activeChat: any) => {
  const { user } = useAuth();
  const { openChat } = useChat();

  const [messages, setMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
    const handleMessage = (msg: any) => {
      console.log("Received: ", msg);

      const senderId =
        typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      const receiverId = msg.receiver;

      setMessages((prev) => [...prev, msg]);

      if (receiverId === user?._id) {
        openChat({
          _id: senderId,
          name: msg.sender?.name || "User",
          username: msg.sender?.username || "",
          avatar: msg.sender?.avatar || "",
        });
      }

      //   if (
      //     activeChat &&
      //     (senderId === activeChat._id || receiverId === activeChat._id)
      //   ) {
      //     setMessages((prev) => [...prev, msg]);
      //   }
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [user, openChat]);
  return { messages, setMessages };
};
