import { create } from 'zustand'

export const usePactStore = create(set => ({
  activePacts: [],
  addPact: (player) => set((state) => ({
    activePacts: [...state.players, player]
  })),
  updatePact: (updatedPlayer) => set((state) => ({
    activePacts: state.activePacts.map((player) =>
      player._id.toString() === updatedPlayer._id.toString() ? updatedPlayer : player
    )
  })),
  setPact: (newPlayersArray) => set(() => ({
    activePacts: newPlayersArray
  })),
  removePact: (id) => set((state) => ({
    activePacts: state.activePacts.filter((player) => player._id.toString() !== id)
  })),

}))