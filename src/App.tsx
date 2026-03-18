import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useAuth } from "./context/AuthContext";
import React from "react";
import Profile from "./pages/Profile";

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
