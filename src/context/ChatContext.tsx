import React from "react";

type ChatUser = {
  _id: string;
  name: string;
  username: string;
  avatar: string;
};

type ChatMode = "floating" | "inbox";

type ChatContextType = {
  activeChat: ChatUser | null;
  isOpen: boolean;
  isMinimized: boolean;
  mode: ChatMode;
  openChat: (user: ChatUser, mode?: ChatMode) => void;
  closeChat: () => void;
  toggleMinimize: () => void;
  unreadCounts: any;
  incrementUnread: (e: string) => void;
  clearUnread: (e: string) => void;
  totalUnreadConversations: number;
};

const ChatContext = React.createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: any) => {
  const STORAGE_KEY = "chat_state";

  const [activeChat, setActiveChat] = React.useState<ChatUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).activeChat : null;
  });

  const [isOpen, setIsOpen] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).isOpen : false;
  });

  const [isMinimized, setIsMinimized] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).isMinimized : false;
  });

  const [unreadCounts, setUnreadCounts] = React.useState<
    Record<string, number>
  >({});

  const [mode, setMode] = React.useState<ChatMode>("floating");

  const toggleMinimize = () => setIsMinimized((prev: any) => !prev);

  const totalUnreadConversations = Object.values(unreadCounts).filter(
    (count) => count > 0,
  ).length;

  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ activeChat, isOpen, isMinimized }),
    );
  }, [activeChat, isOpen, isMinimized]);

  const openChat = (user: ChatUser, type: ChatMode = "floating") => {
    setActiveChat(user);
    setIsOpen(true);
    setMode(type);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const incrementUnread = (userId: string) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1,
    }));
  };

  const clearUnread = (userId: string) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: 0,
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        activeChat,
        isOpen,
        isMinimized,
        openChat,
        closeChat,
        toggleMinimize,
        unreadCounts,
        incrementUnread,
        clearUnread,
        mode,
        totalUnreadConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = React.useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
};
