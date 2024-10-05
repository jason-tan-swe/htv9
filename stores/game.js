import { create } from 'zustand'

export const useGameStateStore = create(set => ({
  current: {
    players: [],
    pactId: '',
    hasPlayerOneConfirmed: false,
    hasPlayerTwoConfirmed: false,
    playerOneMsg: '',
    playerTwoMsg: ''
  },
  updateGameState: fields =>
    set(state => ({ current: { ...state.current, ...fields } }))
}))