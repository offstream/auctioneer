import create from "zustand";
import jwtDecode from "jwt-decode";

type UserStore = {
  user_id: number;
};

function userIdFromToken(token: string) {
  try {
    return jwtDecode<{ user_id?: number }>(token).user_id ?? 0;
  } catch {
    return 0;
  }
}

export const useUserStore = create<UserStore>(set => ({
  user_id: userIdFromToken(localStorage.getItem("refreshToken") ?? ""),
}));

export const setUserIdFromToken = (token: string) =>
  useUserStore.setState({ user_id: userIdFromToken(token) });
