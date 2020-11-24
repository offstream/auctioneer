import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

export const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn)
      navigate("/login", {
        state: { from: location.pathname },
      });
  });

  return <Outlet />;
};
