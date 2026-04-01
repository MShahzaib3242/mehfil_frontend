import React, { act } from "react";
import { useChat } from "../../context/ChatContext";
import { AnimatePresence, isNear, motion } from "framer-motion";
import { dummyImage } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../socket";
import MessageBubble from "./MessageBubble";
import { useChatMessages } from "../../hooks/Chat/useChatMessages";
import { useActiveUsers } from "../../hooks/User/useActiveUsers";
import { timeAgo } from "../../utils/timeAgo";
import { useLocation, useNavigate } from "react-router-dom";
import ActiveUserDot from "../ui/ActiveUserDot";
import { useBlockStatus } from "../../hooks/User/useBlockStatus";

function ChatBox() {
  const navigate = useNavigate();
  const {
    activeChat,
    isOpen,
    closeChat,
    isMinimized,
    toggleMinimize,
    clearUnread,
    unreadCounts,
    mode,
    openChat,
  } = useChat();
  const { user } = useAuth();
  if (!user) return null;
  const { data: users = [] } = useActiveUsers();

  const currentUser = users.find((u: any) => u._id === activeChat?._id);

  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const [text, setText] = React.useState("");
  const { messages, isLoading } = useChatMessages(activeChat);

  const [isTyping, setIsTyping] = React.useState(false);

  const unread = unreadCounts[activeChat?._id || 0] || 0;

  const { data: blockData } = useBlockStatus(activeChat?._id);

  const handleSend = () => {
    if (!text.trim() || !activeChat) return;

    socket.emit("sendMessage", {
      sender: user?._id,
      receiver: activeChat?._id,
      text,
    });

    setText("");
  };

  React.useEffect(() => {
    if (isOpen && activeChat && !isMinimized) {
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
      });
    }
  }, [messages, isMinimized, isOpen, activeChat]);

  React.useEffect(() => {
    if (activeChat?._id && isOpen && !isMinimized) {
      clearUnread(activeChat._id);
    }
  }, [isOpen, activeChat, isMinimized]);

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (isLoading) {
    return <div className="p-3 text-gray-400">Loading...</div>;
  }

  return (
    <AnimatePresence>
      {isOpen && activeChat && mode === "floating" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-10 w-[320px] bg-white border rounded-xl shadow-xl z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-3 border-b relative">
            {isMinimized && unread > 0 && (
              <div className="absolute left-2 top-1 h-4 w-4 text-[10px] rounded-full bg-red-500 flex items-center justify-center text-white">
                {unread}
              </div>
            )}
            <div className="flex items-center gap-2">
              <img
                src={activeChat.avatar || dummyImage}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div
                className="text-sm font-medium flex flex-col cursor-pointer"
                onClick={() => {
                  openChat(activeChat, "inbox");
                  navigate("/inbox");
                }}
              >
                {activeChat.name}
                <p className="text-xs text-gray-500">
                  {currentUser?.isOnline ? (
                    <span className="flex items-center gap-1">
                      <ActiveUserDot /> Online
                    </span>
                  ) : (
                    `Last seen ${timeAgo(currentUser?.lastSeen)}`
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleMinimize}>-</button>
              <button onClick={closeChat}>x</button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 p-3 overflow-y-auto text-sm flex flex-col gap-2 max-h-96">
                {sortedMessages.map((m, i) => (
                  <MessageBubble key={i} message={m} />
                ))}
                <div ref={bottomRef} />
                {/* <p className="text-gray-400 text-center">Start conversation...</p> */}
              </div>

              {blockData?.isBlocked ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  {blockData?.blockedByMe
                    ? "You've blocked this user."
                    : blockData?.blockedByOther
                      ? "This user blocked you."
                      : "You can't message this user"}
                </div>
              ) : (
                <div className="p-2 border-t flex gap-2">
                  <textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);

                      if (!isTyping) {
                        setIsTyping(true);

                        socket.emit("typing", {
                          sender: user?._id,
                          receiver: activeChat._id,
                        });
                      }

                      setTimeout(() => {
                        setIsTyping(false);
                        socket.emit("stopTyping", {
                          sender: user?._id,
                          receiver: activeChat._id,
                        });
                      }, 5000);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-md px-3 py-2 text-sm resize-none"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-mehfil-primary text-white px-3 rounded-md text-sm"
                  >
                    Send
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatBox;
