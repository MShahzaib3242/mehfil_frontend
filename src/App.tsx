import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import { useCurrentUser } from "./hooks/User/useCurrentUser";
import { useAuth } from "./context/AuthContext";
import React from "react";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Security from "./pages/Security";
import DeactivatedModal from "./components/ui/DeactivatedModal";
import PasswordUpdatedModal from "./components/ui/PasswordUpdatedModal";
import { socket } from "./socket";
import { useRealTimeNotifications } from "./hooks/Notifications/useRealTimeNotifications";
import Notifications from "./pages/Notifications";
import PostDetails from "./pages/PostDetails";
import { useNotifications } from "./hooks/Notifications/useNotifications";

function App() {
  useRealTimeNotifications(); // Real time notifications via socket

  const { data } = useCurrentUser();
  const { user, setUser } = useAuth();
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (user?._id && token) {
      socket.emit("register", user._id);
    }
  }, [user]);

  useNotifications({
    enabled: !!token && !!user?._id,
  });

  return (
    <BrowserRouter>
      <PasswordUpdatedModal />
      <DeactivatedModal />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security"
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
