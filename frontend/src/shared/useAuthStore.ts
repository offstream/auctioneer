import create from "zustand";
import { persist } from "zustand/middleware";

export type AuthStore = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export const authStoreKey = "authStore";

const persistOptions = {
  name: authStoreKey,
  storage: sessionStorage,
};

function getFromSessionStorage(
  valueKey: string,
  defaultVal: any = null,
  storageSettings: typeof persistOptions | any,
) {
  const { name, storage = localStorage, deserializer = JSON.parse } = storageSettings;
  return deserializer(storage.getItem(name) ?? "{}")[valueKey] ?? defaultVal;
}

export const useAuthStore = create<AuthStore>(
  persist(
    set => ({
      isLoggedIn: getFromSessionStorage("isLoggedIn", false, persistOptions),
      login: () => set(state => ({ isLoggedIn: true })),
      logout: () => set(state => ({ isLoggedIn: false })),
    }),
    persistOptions,
  ),
);
