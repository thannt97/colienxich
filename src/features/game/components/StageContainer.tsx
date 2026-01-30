import React, { useEffect, useState, useRef } from 'react';
import { Stage } from 'react-konva';
import StaticLayer from './StaticLayer';
import { TriangleLayer } from './TriangleLayer';
import { useGameStore } from '../store/game-store';
import './StageContainer.css';

import { useInteraction } from '../hooks/useInteraction';
import DynamicLayer from './DynamicLayer';

interface StageContainerProps {
    boardRadius?: number;
}

const StageContainer: React.FC<StageContainerProps> = ({ boardRadius = 3 }) => {
    const resetCounter = useGameStore(state => state.resetCounter);
    const { dragStateRef, handlePointerDown, handlePointerMove, handlePointerUp } = useInteraction();

    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        handleResize(); // Initial measurement
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Simple auto-scaling to keep the board centered and visible
    const baseSize = 30; // HEX_LAYOUT.size
    const boardWidth = (boardRadius * 2 + 1) * Math.sqrt(3) * baseSize;
    const boardHeight = (boardRadius * 2 + 1) * 2 * baseSize * 0.75;

    const margin = 40;
    const scale = Math.min(
        (dimensions.width - margin) / boardWidth,
        (dimensions.height - margin) / boardHeight,
        1 // Cap at 1 to prevent pixelation
    );

    // Only render Stage when dimensions are ready
    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {dimensions.width > 0 && dimensions.height > 0 && (
                <div className="stage-wrapper" key={resetCounter}>
                    <Stage
                        width={dimensions.width}
                        height={dimensions.height}
                        scaleX={scale}
                        scaleY={scale}
                        x={dimensions.width / 2}
                        y={dimensions.height / 2}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        <TriangleLayer />
                        <StaticLayer radius={boardRadius} />
                        <DynamicLayer dragStateRef={dragStateRef} />
                    </Stage>
                </div>
            )}
        </div>
    );
};

export default StageContainer;
