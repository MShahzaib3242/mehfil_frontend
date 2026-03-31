import React from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useChatMessages } from "../../hooks/Chat/useChatMessages";
import { socket } from "../../socket";
import MessageBubble from "./MessageBubble";

function ChatWindow() {
  const { activeChat, clearUnread } = useChat();
  const { user } = useAuth();
  const { messages, isLoading } = useChatMessages(activeChat);

  const [text, setText] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const [typingUser, setTypingUser] = React.useState<string | null>(null);

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
      behavior: messages.length > 0 ? "smooth" : "auto",
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

  return (
    <div className="h-full flex flex-col">
      {/* Header  */}
      <div className="p-3 border-b font-semibold">{activeChat.name}</div>

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

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
