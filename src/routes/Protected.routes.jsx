import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" replace />;
};



export const PublicRoutes = ({children}) => {
    const token = localStorage.getItem("token");

    return !token ? children : <Navigate to="/dashboard" replace  />
}