import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../shared/useAuthStore";

export const AnonOnlyRoute: React.FC = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) navigate(location.state?.from ?? "/home");
  }, [location, navigate, isLoggedIn]);
  return <Outlet />;
};
