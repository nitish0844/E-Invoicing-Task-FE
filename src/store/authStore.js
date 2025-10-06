import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => {
      return {
        auth: {},
        saveAuth: (authObj) => {
          set({
            auth: {
              ...authObj,
            },
          });
        },
        resetAuth: () => {
          set({ auth: {} }, true);
          window?.location?.replace?.("/");
        },
      };
    },
    {
      name: "@_aim_auth_",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
