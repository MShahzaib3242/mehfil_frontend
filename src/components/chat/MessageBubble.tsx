import React from "react";
import { useAuth } from "../../context/AuthContext";

function MessageBubble({ message }: any) {
  const { user } = useAuth();

  const senderId =
    typeof message.sender === "object" ? message.sender._id : message.sender;

  const isMe = senderId === user?._id;

  return (
    <div className="flex flex-col gap-0 items-end">
      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
          isMe
            ? "bg-mehfil-primary text-white self-end"
            : "bg-gray-200 self-start"
        }`}
      >
        {message.text}
      </div>
      {isMe && (
        <span className="text-[10px] text-gray-400 ml-2">
          {message.seen ? "Seen" : message.delivered ? "Delivered" : "Sent"}
        </span>
      )}
    </div>
  );
}

export default MessageBubble;
