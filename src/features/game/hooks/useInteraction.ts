import { useRef, useCallback, useEffect } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { useGameStore } from '../store/game-store';
import { pixelToAxial, roundAxial, generateHexGrid, isValidStraightLine, AxialCoord } from '../logic/grid-utils';
import { detectNewTriangles, VALID_TRIANGLES, Triangle } from '../logic/triangle-detector';
import { checkGameOver, determineWinner } from '../logic/game-logic';
import { getRandomMove, calculateAllValidMoves } from '../services/ai-bot';
import { useOnlineGame } from './useOnlineGame';

// Game board configuration
const BOARD_RADIUS = 3;

// AC2: AI move delay: 500ms-1s for natural feel
const AI_MOVE_DELAY_MIN = 500;
const AI_MOVE_DELAY_MAX = 1000;

export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    startPeg: AxialCoord | null;
}

export const useInteraction = () => {
    // Ref-based state for zero-binding performance
    const dragStateRef = useRef<DragState>({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startPeg: null,
    });

    // Online game hook for PvP
    const { sendPlayerMove } = useOnlineGame();

    // Ref to track AI timeout for cleanup
    const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Adds only new (non-duplicate) triangles to the store.
     * Extracted to avoid code duplication between player and AI moves.
     */
    const addUniqueTriangles = useCallback((newTriangles: Triangle[]) => {
        const existingTriangles = useGameStore.getState().triangles;
        const newTrianglesAdded: Triangle[] = [];

        for (const triangle of newTriangles) {
            const isDuplicateTriangle = existingTriangles.some(t =>
                t.vertices[0].q === triangle.vertices[0].q &&
                t.vertices[0].r === triangle.vertices[0].r &&
                t.vertices[1].q === triangle.vertices[1].q &&
                t.vertices[1].r === triangle.vertices[1].r &&
                t.vertices[2].q === triangle.vertices[2].q &&
                t.vertices[2].r === triangle.vertices[2].r
            );

            if (!isDuplicateTriangle) {
                useGameStore.getState().addTriangle(triangle);
                newTrianglesAdded.push(triangle);
            }
        }

        return newTrianglesAdded;
    }, []);

    // Cleanup AI timeout on unmount
    useEffect(() => {
        return () => {
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current);
            }
        };
    }, []);

    /**
     * Executes an AI move: calculates valid moves, selects one randomly,
     * and executes it after a natural delay.
     *
     * NOTE: This function is fire-and-forget (called without await in handlePointerUp).
     * It's safe because:
     * 1. Player input is blocked during opponent's turn (checked in handlePointerDown)
     * 2. AI timeout is tracked and cleaned up on unmount
     * 3. Game status is checked before/after delay to handle interrupts
     */
    const executeAIMove = useCallback(async () => {
        try {
            const gameMode = useGameStore.getState().gameMode;
            const currentTurn = useGameStore.getState().currentTurn;

            // Only execute AI in single-player mode when it's opponent's turn
            if (gameMode !== 'single-player' || currentTurn !== 'opponent') {
                return;
            }

            // Check if game is still active
            const gameStatus = useGameStore.getState().gameStatus;
            if (gameStatus !== 'active') {
                return;
            }

            // Calculate all valid moves
            const existingLines = useGameStore.getState().lines;
            const validPegs = generateHexGrid(BOARD_RADIUS);
            const validMoves = calculateAllValidMoves(existingLines, validPegs);

            if (validMoves.length === 0) {
                // No valid moves - game should be over
                const allLines = useGameStore.getState().lines;
                if (checkGameOver(allLines, BOARD_RADIUS)) {
                    const scores = useGameStore.getState().score;
                    const winner = determineWinner(scores);
                    useGameStore.getState().endGame(winner);
                }
                return;
            }

            // Get random move from AI
            const aiMove = getRandomMove(validMoves);
            if (!aiMove) {
                return;
            }

            // Wait for AI delay (500ms-1s) to create natural feel
            const delay = AI_MOVE_DELAY_MIN + Math.random() * (AI_MOVE_DELAY_MAX - AI_MOVE_DELAY_MIN);
            await new Promise(resolve => {
                aiTimeoutRef.current = setTimeout(resolve, delay);
            });

            // Check if game was interrupted (reset while AI was "thinking")
            const currentGameStatus = useGameStore.getState().gameStatus;
            if (currentGameStatus !== 'active') {
                return;
            }

            // Execute AI move - add line
            useGameStore.getState().addLine({
                start: aiMove.start,
                end: aiMove.end
            });

            // Detect triangles after AI move
            const allLines = useGameStore.getState().lines;
            const newTriangles = detectNewTriangles(allLines, 'player2', VALID_TRIANGLES);

            // Add only new triangles (deduplicated)
            const addedTriangles = addUniqueTriangles(newTriangles);

            // Update AI score
            if (addedTriangles.length > 0) {
                useGameStore.getState().addScore('opponent', addedTriangles.length);
            }

            // Check for game over
            if (checkGameOver(allLines, BOARD_RADIUS)) {
                const scores = useGameStore.getState().score;
                const winner = determineWinner(scores);
                useGameStore.getState().endGame(winner);
            } else {
                // Toggle turn back to player
                useGameStore.getState().toggleTurn();
            }
        } catch (error) {
            // Log error but ensure game continues even if AI move fails
            console.error('AI move execution failed:', error);
            // Reset turn to player so game doesn't get stuck
            const currentTurn = useGameStore.getState().currentTurn;
            if (currentTurn === 'opponent') {
                useGameStore.getState().toggleTurn();
            }
        }
    }, [addUniqueTriangles]);

    const handlePointerDown = useCallback((e: KonvaEventObject<PointerEvent>) => {
        // Only allow interaction if game is active
        const gameStatus = useGameStore.getState().gameStatus;
        if (gameStatus !== 'active') {
            return;
        }

        // In single-player mode, only allow player to move during their turn
        // In online-pvp mode, we'll let the server handle turn validation
        const gameMode = useGameStore.getState().gameMode;
        const currentTurn = useGameStore.getState().currentTurn;
        if (gameMode === 'single-player' && currentTurn !== 'player') {
            return;
        }

        // In online-pvp, check if it's the player's turn (player role vs current turn)
        if (gameMode === 'online-pvp') {
            const myPlayerRole = useGameStore.getState().myPlayerRole;
            // player1 role = player turn, player2 role = opponent turn
            const isMyTurn = (myPlayerRole === 'player1' && currentTurn === 'player') ||
                           (myPlayerRole === 'player2' && currentTurn === 'opponent');
            if (!isMyTurn) {
                return;
            }
        }

        // For now, we just check if we hit a peg (pegs have listening=true on their hit area)
        const stage = e.target.getStage();
        if (!stage) return;

        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return;

        // Convert page coordinates to stage coordinates
        const transform = stage.getAbsoluteTransform().copy().invert();
        const pos = transform.point(pointerPos);

        // In a real implementation, we'd check if we hit a peg specifically.
        // For Story 2.1, we assume if we hit something listening, it's a peg 
        // (StaticLayer hit areas are configured this way).
        if (e.target !== stage) {
            // Get the center of the hit area (which is the peg center)
            // The node is relative to its layer, so we use its relative x/y if it's the group
            // or we use its absolute position and transform it.
            const node = e.target;
            const absPos = node.getAbsolutePosition();
            const startPos = transform.point(absPos);

            // Convert pixel position to axial coordinates to identify the peg
            const axial = pixelToAxial(startPos.x, startPos.y);
            const pegCoords = roundAxial(axial.q, axial.r);

            dragStateRef.current = {
                isDragging: true,
                startX: startPos.x,
                startY: startPos.y,
                currentX: pos.x,
                currentY: pos.y,
                startPeg: pegCoords,
            };
        }
    }, [sendPlayerMove]);

    const handlePointerMove = useCallback((e: KonvaEventObject<PointerEvent>) => {
        if (!dragStateRef.current.isDragging) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return;

        const transform = stage.getAbsoluteTransform().copy().invert();
        const pos = transform.point(pointerPos);

        dragStateRef.current.currentX = pos.x;
        dragStateRef.current.currentY = pos.y;
    }, []);

    const handlePointerUp = useCallback(() => {
        if (!dragStateRef.current.isDragging || !dragStateRef.current.startPeg) {
            dragStateRef.current.isDragging = false;
            return;
        }

        const { currentX, currentY, startPeg } = dragStateRef.current;

        // Convert current pointer position to axial coordinates
        const axial = pixelToAxial(currentX, currentY);
        const endPeg = roundAxial(axial.q, axial.r);

        // Validate that endPeg is on the board (within board radius)
        const validPegs = generateHexGrid(BOARD_RADIUS);
        const isValidPeg = validPegs.some(p => p.q === endPeg.q && p.r === endPeg.r);

        // Check for duplicate lines (bidirectional)
        const existingLines = useGameStore.getState().lines;
        const isDuplicate = existingLines.some(line =>
            (line.start.q === startPeg.q && line.start.r === startPeg.r &&
                line.end.q === endPeg.q && line.end.r === endPeg.r) ||
            (line.start.q === endPeg.q && line.start.r === endPeg.r &&
                line.end.q === startPeg.q && line.end.r === startPeg.r)
        );

        // Only create a line if:
        // 1. End peg is valid (on the board)
        // 2. Line is straight and passes through exactly 4 pegs
        // 3. Line is not a duplicate
        if (isValidPeg && isValidStraightLine(startPeg.q, startPeg.r, endPeg.q, endPeg.r) && !isDuplicate) {
            const newLine = {
                start: startPeg,
                end: endPeg,
            };

            // Check game mode to determine how to handle the move
            const gameMode = useGameStore.getState().gameMode;

            if (gameMode === 'online-pvp') {
                // In online mode, send move to server
                // Server will validate, broadcast, and update game state
                sendPlayerMove(newLine);
            } else {
                // Local game modes (single-player, hotseat) - process locally
                useGameStore.getState().addLine(newLine);

                // Detect triangles after adding the line
                const trianglePlayer = useGameStore.getState().currentTurn === 'player' ? 'player1' : 'player2';
                const allLines = useGameStore.getState().lines;
                const newTriangles = detectNewTriangles(allLines, trianglePlayer, VALID_TRIANGLES);

                // Add only new triangles (deduplicated)
                const newTrianglesAdded = addUniqueTriangles(newTriangles);

                // Update score: +1 point per triangle created (AC2)
                if (newTrianglesAdded.length > 0) {
                    const scorePlayer = useGameStore.getState().currentTurn === 'player' ? 'player' : 'opponent';
                    useGameStore.getState().addScore(scorePlayer, newTrianglesAdded.length);
                }

                // Check for game over (AC1)
                const allLinesAfterMove = useGameStore.getState().lines;
                if (checkGameOver(allLinesAfterMove, BOARD_RADIUS)) {
                    const scores = useGameStore.getState().score;
                    const winner = determineWinner(scores);
                    useGameStore.getState().endGame(winner);
                } else {
                    // Toggle turn if game is not over
                    useGameStore.getState().toggleTurn();

                    // Trigger AI move if in single-player mode (fire-and-forget is safe here)
                    const gameMode = useGameStore.getState().gameMode;
                    if (gameMode === 'single-player') {
                        // AI will move after toggle (now it's opponent's turn)
                        // Not awaiting because player input is blocked during opponent's turn
                        executeAIMove();
                    }
                }
            }
        }

        dragStateRef.current.isDragging = false;
    }, [executeAIMove, addUniqueTriangles, sendPlayerMove]);

    return {
        dragStateRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    };
};
