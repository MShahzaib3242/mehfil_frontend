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
  const {
    openChat,
    incrementUnread,
    isMinimized,
    mode,
    isOpen,
    messages,
    setMessages,
  } = useChat();

  const queryClient = useQueryClient();

  React.useEffect(() => {
    setMessages([]);
  }, [activeChat?._id]);

  React.useEffect(() => {
    if (!activeChat?._id) return;
    if (!history) return;

    setMessages((prev: any) => {
      const merged = [...history];

      prev.forEach((m: any) => {
        if (!merged.some((h: any) => h._id === m._id)) {
          merged.push(m);
        }
      });

      return merged;
    });
  }, [history, activeChat?._id]);
  // React.useEffect(() => {
  //   if (!history) return;

  //   setMessages((prev) => {
  //     const prevIds = prev.map((m) => m._id).join(",");
  //     const newIds = history.map((m: any) => m._id).join(",");

  //     if (prevIds === newIds) return prev;

  //     return history;
  //   });
  // }, [history]);

  React.useEffect(() => {
    if (!user?._id) return;

    const handleMessage = (msg: any) => {
      const senderId =
        typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      const receiverId =
        typeof msg.receiver === "object" ? msg.receiver._id : msg.receiver;

      if (
        activeChat?._id &&
        (senderId === activeChat._id || receiverId === activeChat._id)
      ) {
        setMessages((prev: any) => {
          const exists = prev.some((m: any) => m._id === msg._id);

          if (exists) return prev;

          return [...prev, msg];
        });
      }

      if (receiverId === user?._id) {
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

      if (
        receiverId === user?._id &&
        activeChat?._id === senderId &&
        !isMinimized &&
        isOpen
      ) {
        socket.emit("markSeen", {
          userId: user._id,
          chatUserId: senderId,
        });
      }

      queryClient.setQueryData(["conversations"], (old: any) => {
        if (!old) return old;

        const isSenderMe = senderId === user?._id;

        const otherUser = isSenderMe ? { _id: receiverId } : msg.sender;

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

    socket.off("newMessage");
    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [user, activeChat?._id, isMinimized, isOpen, mode]);

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

  React.useEffect(() => {
    const handleSeen = ({ userId }: any) => {
      setMessages((prev: any) =>
        prev.map((m: any) => {
          const senderId =
            typeof m.sender === "object" ? m.sender._id : m.sender;

          const receiverId =
            typeof m.receiver === "object" ? m.receiver._id : m.receiver;

          if (receiverId === userId && senderId === user?._id) {
            return { ...m, seen: true };
          }

          return m;
        }),
      );
    };

    socket.on("messagesSeen", handleSeen);

    return () => {
      socket.off("messagesSeen", handleSeen);
    };
  }, []);

  return { messages, isLoading };
};
