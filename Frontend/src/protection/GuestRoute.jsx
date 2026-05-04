import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

const GuestRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get("/auth/me");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) return <p>checking authentication status ....</p>;
  if (isLoggedIn) return <Navigate to="/movies" />;
  return children;
};

export default GuestRoute;
