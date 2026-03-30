import React from "react";

type ChatUser = {
  _id: string;
  name: string;
  username: string;
  avatar: string;
};

type ChatContextType = {
  activeChat: ChatUser | null;
  isOpen: boolean;
  openChat: (user: ChatUser) => void;
  closeChat: () => void;
};

const ChatContext = React.createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: any) => {
  const [activeChat, setActiveChat] = React.useState<ChatUser | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const openChat = (user: ChatUser) => {
    setActiveChat(user);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <ChatContext.Provider value={{ activeChat, isOpen, openChat, closeChat }}>
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
