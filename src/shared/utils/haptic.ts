/**
 * Haptic feedback utility for mobile devices.
 * Uses the Web Vibration API.
 */
export const haptic = {
    /**
     * Vibrate the device for a short duration or a specific pattern.
     * @param pattern Duration in milliseconds or an array of durations (vibrate/pause)
     */
    vibrate: (pattern: number | number[] = 10) => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (error) {
                // Ignore vibration errors as they are non-critical
                console.warn('Haptic feedback failed', error);
            }
        }
    },

    /**
     * Predetermined patterns for Haptic Feedback
     */
    patterns: {
        light: 10,
        medium: 20,
        heavy: 50,
        success: [10, 30, 10],
        error: [50, 50, 50],
    }
};
