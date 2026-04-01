import React from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useChatMessages } from "../../hooks/Chat/useChatMessages";
import { socket } from "../../socket";
import MessageBubble from "./MessageBubble";
import { useDeleteConversation } from "../../hooks/Chat/useDeleteConversation";
import { InfoIcon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useActiveUsers } from "../../hooks/User/useActiveUsers";
import { dummyImage } from "../../utils/constants";
import { timeAgo } from "../../utils/timeAgo";
import ActiveUserDot from "../ui/ActiveUserDot";
import { useBlockStatus } from "../../hooks/User/useBlockStatus";

function ChatWindow() {
  const navigate = useNavigate();
  const { activeChat, clearUnread } = useChat();
  const { user } = useAuth();
  const { data: users = [] } = useActiveUsers();

  const { messages, isLoading } = useChatMessages(activeChat);
  const deleteConv = useDeleteConversation();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [text, setText] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const [typingUser, setTypingUser] = React.useState<string | null>(null);
  const currentUser = users.find((u: any) => u._id === activeChat?._id);
  const { data: blockData } = useBlockStatus(activeChat?._id);

  const handleSend = () => {
    if (!text.trim() || !activeChat) return;

    socket.emit("sendMessage", {
      sender: user?._id,
      receiver: activeChat._id,
      text,
    });

    setText("");
  };

  React.useEffect(() => {
    socket.on("typing", ({ sender }) => {
      if (sender === activeChat?._id) {
        setTypingUser(sender);
      }
    });

    socket.on("stopTyping", ({ sender }) => {
      if (sender === activeChat?._id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [activeChat]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  React.useEffect(() => {
    if (activeChat?._id) {
      clearUnread(activeChat._id);
    }
  }, [activeChat]);

  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a conversation
      </div>
    );
  }

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (isLoading) {
    return <div className="p-4 text-gray-400">Loading...</div>;
  }

  console.log("block Data", blockData);

  return (
    <div className="h-full flex flex-col">
      {/* Header  */}
      <div className="flex w-full justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <img
            src={activeChat?.avatar || dummyImage}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <div className="font-semibold">{activeChat.name}</div>
            <p className="text-xs text-gray-500">
              {currentUser?.isOnline ? (
                <span className="flex items-center gap-1">
                  <ActiveUserDot /> Online
                </span>
              ) : currentUser?.lastSeen ? (
                `Last Seen ${timeAgo(currentUser.lastSeen)}`
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-gray-400 hover:text-mehfil-primary"
            onClick={() => navigate(`/user/${activeChat?._id}`)}
          >
            <InfoIcon size={16} />
          </button>
          <button className="text-red-500" onClick={() => setConfirmOpen(true)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages  */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {sortedMessages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {typingUser && (
          <p className="text-xs text-gray-400 px-4 pb-2">Typing...</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input  */}
      {blockData?.isBlocked ? (
        <div className="p-3 text-center text-sm text-gray-500">
          {blockData?.blockedByMe
            ? "You've blocked this user."
            : blockData?.blockedByOther
              ? "This user blocked you."
              : "You can't message this user"}
        </div>
      ) : (
        <div className="p-3 border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 border rounded-md px-3 py-2"
          />

          <button
            onClick={handleSend}
            className="bg-mehfil-primary text-white px-3 rounded-md text-sm"
          >
            Send
          </button>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Conversation?"
        description="Are you sure you want to delete this conversation? This cannot be undone."
        onConfirm={() => {
          deleteConv.mutate(activeChat?._id);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}

export default ChatWindow;
