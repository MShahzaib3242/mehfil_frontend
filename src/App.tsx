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

function App() {
  const { data } = useCurrentUser();
  const { setUser } = useAuth();

  React.useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
