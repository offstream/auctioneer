import create from "zustand";

type UserStore = {
  user_id: number | null;
};

export const useUserStore = create<UserStore>(set => ({
  user_id: null,
}));
