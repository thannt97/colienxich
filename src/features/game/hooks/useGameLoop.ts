import { useEffect, useRef } from 'react';

/**
 * A custom hook that provides a high-performance game loop using requestAnimationFrame.
 * @param callback The function to be called on every frame.
 * @param enabled Whether the game loop is active.
 */
export const useGameLoop = (callback: (time: number) => void, enabled: boolean = true) => {
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();

    const animate = (time: number) => {
        if (previousTimeRef.current !== undefined) {
            callback(time);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (enabled) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            previousTimeRef.current = undefined;
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [enabled, callback]);
};
