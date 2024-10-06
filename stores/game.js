import { create } from 'zustand'

export const useGameStateStore = create(set => ({
  current: {
    players: [],
    pactId: '',
    hasPlayerOneConfirmed: false,
    hasPlayerTwoConfirmed: false,
    playerOneMsg: '',
    playerTwoMsg: '',
    isFirstPlayer: false,
    hasPlayerJoined: false,
  },
  updateGameState: fields =>
    set(state => ({ current: { ...state.current, ...fields } }))
}))