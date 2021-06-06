import { useState } from "react";
import authService from "./authService/index_v2";
import { useUserStore } from "./useUserStore";
// import { delay } from "./utils";

const initializeAuth = () => {
  let status = "pending";
  let error = "";

  const initializing = authService
    .start()
    // .then(delay(500))
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
