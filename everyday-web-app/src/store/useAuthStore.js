import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isHydrated: false,
      setUser: (user) => set({ user, isLoggedIn: Boolean(user) }),
      clear: () => set({ user: null, isLoggedIn: false }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'everyday-auth',
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
