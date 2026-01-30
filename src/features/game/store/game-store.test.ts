import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './game-store'

describe('game-store', () => {
    beforeEach(() => {
        useGameStore.getState().resetGame()
    })

    it('should have initial state', () => {
        const state = useGameStore.getState()
        expect(state.score).toEqual({ player: 0, opponent: 0 })
        expect(state.currentTurn).toBe('player')
        expect(state.gameStatus).toBe('active')
        expect(state.winner).toBe(null)
    })

    it('should add score correctly', () => {
        const { addScore } = useGameStore.getState()

        addScore('player', 1)
        expect(useGameStore.getState().score.player).toBe(1)

        addScore('opponent', 3)
        expect(useGameStore.getState().score.opponent).toBe(3)
    })

    it('should toggle turn', () => {
        const { toggleTurn } = useGameStore.getState()

        toggleTurn()
        expect(useGameStore.getState().currentTurn).toBe('opponent')

        toggleTurn()
        expect(useGameStore.getState().currentTurn).toBe('player')
    })

    it('should reset game', () => {
        const { addScore, toggleTurn, addLine, resetGame } = useGameStore.getState()

        addScore('player', 5)
        toggleTurn()
        addLine({ start: { q: 0, r: 0 }, end: { q: 1, r: 0 } })
        resetGame()

        const state = useGameStore.getState()
        expect(state.score).toEqual({ player: 0, opponent: 0 })
        expect(state.currentTurn).toBe('player')
        expect(state.gameStatus).toBe('active')
        expect(state.lines).toEqual([])
    })

    it('should add lines correctly', () => {
        const { addLine } = useGameStore.getState()
        const newLine = { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } }

        addLine(newLine)
        // addLine auto-adds 'player' field from currentTurn (defaults to 'player1')
        expect(useGameStore.getState().lines[0]).toMatchObject({
            start: { q: 0, r: 0 },
            end: { q: 1, r: 0 },
            player: 'player1'
        })
        expect(useGameStore.getState().lines.length).toBe(1)
    })

    it('should end game and set winner', () => {
        const { endGame } = useGameStore.getState()

        endGame('player')
        expect(useGameStore.getState().gameStatus).toBe('gameOver')
        expect(useGameStore.getState().winner).toBe('player')

        endGame('opponent')
        expect(useGameStore.getState().winner).toBe('opponent')

        endGame('draw')
        expect(useGameStore.getState().winner).toBe('draw')
    })

    it('should reset game including winner state', () => {
        const { addScore, endGame, resetGame } = useGameStore.getState()

        addScore('player', 5)
        endGame('player')
        resetGame()

        const state = useGameStore.getState()
        expect(state.score).toEqual({ player: 0, opponent: 0 })
        expect(state.currentTurn).toBe('player')
        expect(state.gameStatus).toBe('active')
        expect(state.winner).toBe(null)
        expect(state.lines).toEqual([])
    })
})
