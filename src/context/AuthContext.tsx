import React, { createContext, useContext, useState } from "react";

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  login: (token: string) => void;
  logout: () => void;
  isAuthLoading: boolean;
  setAuthLoading: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthLoading, setAuthLoading] = useState(true);

  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isAuthLoading, setAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
