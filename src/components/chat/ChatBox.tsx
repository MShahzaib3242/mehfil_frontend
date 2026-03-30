import React from "react";
import { useChat } from "../../context/ChatContext";
import { AnimatePresence, motion } from "framer-motion";
import { dummyImage } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../socket";
import MessageBubble from "./MessageBubble";
import { useChatMessages } from "../../hooks/Chat/useChatMessages";

function ChatBox() {
  const { activeChat, isOpen, closeChat } = useChat();
  const { user } = useAuth();

  const [text, setText] = React.useState("");
  const { messages } = useChatMessages(activeChat);

  const handleSend = () => {
    if (!text.trim() || !activeChat) return;

    socket.emit("sendMessage", {
      sender: user?._id,
      receiver: activeChat?._id,
      text,
    });

    // setMessages((prev) => [...prev, message]);

    setText("");
  };

  return (
    <AnimatePresence>
      {isOpen && activeChat && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 w-[320px] bg-white border rounded-xl shadow-xl z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <img
                src={activeChat.avatar || dummyImage}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm font-medium">{activeChat.name}</p>
            </div>
            <button onClick={closeChat}>x</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto text-sm flex flex-col gap-2">
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {/* <p className="text-gray-400 text-center">Start conversation...</p> */}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-mehfil-primary text-white px-3 rounded-md text-sm"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatBox;
