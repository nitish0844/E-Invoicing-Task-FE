/* eslint-disable no-unsafe-optional-chaining */
import { create } from "zustand";

const useSelectedTableRowsStore = create(
  (set, get) => {
    return {
      selectedRows: { data: [] },
      addToSelectedRows: (loanDetailObj) => {
        set((old) => ({
          selectedRows: { ...old?.selectedRows, data: [...old?.selectedRows?.data, loanDetailObj] },
        }));
      },
      addAllRows: (recordsArr, count) => {
        set(() => ({
          selectedRows: { data: [...recordsArr], count: count },
        }));
      },
      removeFromSelectedRows: (loanDetailObj) => {
        set((old) => ({
          selectedRows: {
            ...old?.selectedRows,
            data: get().selectedRows?.data?.filter(
              (e) => e?.id !== loanDetailObj?.id
            ),
          }
        }));
      },
      resetSelectedRows: () => {
        set({ selectedRows: { data: [] } });
      },
    };
  },
);

export default useSelectedTableRowsStore;
