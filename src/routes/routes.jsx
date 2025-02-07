import React from "react";
import Login from "../Login/Login";
import { ProtectedRoutes } from "./Protected.routes";
import { PublicRoutes } from "./Protected.routes";
import DashboardLayout from "../components/views";

export const PrivateRoutes =  [
  {
    path: "/",
    element: (
      <PublicRoutes>
        <Login />
      </PublicRoutes>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <DashboardLayout />
      </ProtectedRoutes>
    ),
  },
];
