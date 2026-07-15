import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: ({ access, refresh, user }) =>
        set({ accessToken: access, refreshToken: refresh, user }),

      setAccessToken: (access) => set({ accessToken: access }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "cleckbasket-auth" }
  )
);