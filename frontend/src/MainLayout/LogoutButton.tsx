import React from "react";
import authService from "../shared/authService";
import { useUserStore } from "../shared/useUserStore";

export const LogoutButton: React.FC<React.HtmlHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  const handleLogout = () => {
    authService.logout();
    useUserStore.setState({ user_id: null });
  };
  return (
    <button onClick={handleLogout} {...props}>
      LOGOUT
    </button>
  );
};
