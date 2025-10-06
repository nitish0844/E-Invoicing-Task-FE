import { create } from 'zustand'

const useTitleStore = create(
  set => ({
    titleObj: {},
    setTitleObj: (obj) => set({ titleObj: { ...obj } }),
  })
)

export default useTitleStore;