import React from "react";
import { useAuth } from "../../context/AuthContext";

function MessageBubble({ message }: any) {
  const { user } = useAuth();

  const senderId =
    typeof message.sender === "object" ? message.sender._id : message.sender;

  const isMe = senderId === user?._id;

  return (
    <div
      className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
        isMe
          ? "bg-mehfil-primary text-white self-end"
          : "bg-gray-200 self-start"
      }`}
    >
      {message.text}
    </div>
  );
}

export default MessageBubble;
