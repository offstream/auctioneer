import React from "react";
import { useAuthStore } from "../shared/useAuthStore";

export const LogoutButton: React.FC<React.HtmlHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  const logout = useAuthStore(state => state.logout);
  const handleLogout = () => {
    logout();
  };
  return (
    <button onClick={handleLogout} {...props}>
      LOGOUT
    </button>
  );
};
