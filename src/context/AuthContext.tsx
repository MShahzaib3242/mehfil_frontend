import React, { createContext } from "react";

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
  isDeactivated: boolean;
  setIsDeactivated: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = React.useState<User>(null);
  const [isAuthLoading, setAuthLoading] = React.useState(true);
  const [isDeactivated, setIsDeactivated] = React.useState(false);

  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthLoading,
        setAuthLoading,
        isDeactivated,
        setIsDeactivated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
