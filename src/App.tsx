import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useAuth } from "./context/AuthContext";
import React from "react";
import Profile from "./pages/Profile";
import Loader from "./components/ui/Loader";

function App() {
  const { data, isLoading } = useCurrentUser();
  const { setUser, setAuthLoading, isAuthLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (data) {
        setUser(data);
      }
      setAuthLoading(false);
    }
  }, [data, isLoading]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={30} />
      </div>
    );
  }

  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
