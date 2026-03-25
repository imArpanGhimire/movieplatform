import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

const ProtectedRoute = ({ children }) => {
  const [isloggedin, setisloggedin] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get("/auth/me");
        setisloggedin(true);
      } catch (e) {
        setisloggedin(false);
        console.log(e);
      } finally {
        setloading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) return <p>checking authentication status ....</p>;

  if (!isloggedin) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
