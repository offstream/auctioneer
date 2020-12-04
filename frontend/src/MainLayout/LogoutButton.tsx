import React from "react";
import { logout } from "../shared/authService";

export const LogoutButton: React.FC<React.HtmlHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <button onClick={handleLogout} {...props}>
      LOGOUT
    </button>
  );
};
