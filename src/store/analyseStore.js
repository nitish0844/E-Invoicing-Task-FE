import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAnalyseStore = create(
  persist(
    (set) => {
      return {
        analyse: {},
        setAnalyse: (analyseObj) => {
          set({
            analyse: {
              ...analyseObj,
            },
          });
        },
        resetAnalyse: () => {
          set({ analyse: {} }, true);
          window?.location?.reload?.();
        },
      };
    },
    {
      name: "@_invoice_analyse_",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAnalyseStore;
