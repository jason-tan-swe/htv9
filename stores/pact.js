import { create } from 'zustand'

export const usePactStore = create(set => ({
  current: {
    activePacts: []
  },
  updatePactStore: fields =>
    set(state => ({ current: { ...state.current, ...fields } }))
}))