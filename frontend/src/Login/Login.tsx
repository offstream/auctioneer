import React from "react";
import { useAuthStore } from "../shared/useAuthStore";

export const Login: React.FC = () => {
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    login();
  };

  return (
    <>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </>
  );
};
