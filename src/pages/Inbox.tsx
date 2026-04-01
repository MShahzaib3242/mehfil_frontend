import React from "react";
import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import MainLayout from "../layouts/MainLayout";

function Inbox() {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-2rem)] flex bg-white rounded-xl border">
        {/* Left  */}
        <div className="w-[320px] border-r">
          <ConversationList />
        </div>

        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </MainLayout>
  );
}

export default Inbox;
