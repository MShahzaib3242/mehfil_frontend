import React from "react";
import { timeAgo } from "../../utils/timeAgo";
import { useChat } from "../../context/ChatContext";

function ConversationItem({ conversation }: any) {
  const { user, lastMessage } = conversation;
  const { unreadCounts, activeChat } = useChat();
  const unread = unreadCounts[user?._id] || 0;

  const isActive = activeChat?._id === user._id;

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
    >
      <img src={user.avatar} className="w-10 h-10 rounded-full" />

      <div className="flex-1">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-gray-500 truncate">{lastMessage.text}</p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400">
          {timeAgo(lastMessage.createdAt)}
        </span>

        {unread > 0 && (
          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </div>
    </div>
  );
}

export default ConversationItem;
