import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getConversations } from "../../api/messageApi";
import { useChat } from "../../context/ChatContext";
import ConversationItem from "./ConversationItem";
import { useLocation } from "react-router-dom";

function ConversationList() {
  const { data = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const location = useLocation();

  const { openChat } = useChat();

  return (
    <div className="p-3">
      <div className="text-lg font-semibold mb-3">Messages</div>

      <div className="flex flex-col gap-2">
        {data.map((c: any) => (
          <div key={c.user._id} onClick={() => openChat(c.user, "inbox")}>
            <ConversationItem conversation={c} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
