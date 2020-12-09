import { useState } from "react";
import authService from "./authService";
import { useUserStore } from "./useUserStore";

const initializeAuth = () => {
  let status = "pending";
  let error = "";

  const initializing = authService
    .start()
    .then(({ userId }) => {
      status = "done";
      useUserStore.setState({ user_id: userId });
    })
    .catch(e => {
      status = "error";
      error = e;
      useUserStore.setState({ user_id: null });
    });

  return () => {
    const user_id = useUserStore(state => state.user_id);
    if (status === "pending") {
      throw initializing;
    }
    return { isLoggedIn: !!user_id, status, error };
  };
};

const useInitializeAuth = () => {
  const [authReader] = useState(initializeAuth);
  return authReader;
};

export default useInitializeAuth;
