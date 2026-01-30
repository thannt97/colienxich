import React, { useMemo, useRef, useEffect } from 'react';
import { Layer, Circle, Group, Line } from 'react-konva';
import Konva from 'konva';
import { generateHexGrid, axialToPixel } from '../logic/grid-utils';
import { haptic } from '../../../shared/utils/haptic';
import { useGameStore } from '../store/game-store';

interface StaticLayerProps {
    radius?: number;
}

const StaticLayer: React.FC<StaticLayerProps> = ({ radius = 3 }) => {
    const layerRef = useRef<Konva.Layer>(null);
    const pegs = useMemo(() => generateHexGrid(radius), [radius]);
    const lines = useGameStore(state => state.lines);

    // Cache the layer for performance after initial mount and when pegs/lines change
    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.cache();
        }
    }, [pegs, lines]);

    return (
        <Layer ref={layerRef}>
            {pegs.map((peg) => {
                const { x, y } = axialToPixel(peg.q, peg.r);
                return (
                    <Group
                        key={`${peg.q}-${peg.r}`}
                        x={x}
                        y={y}
                        onClick={() => haptic.vibrate(haptic.patterns.light)}
                        onTap={() => haptic.vibrate(haptic.patterns.light)}
                    >
                        {/* Hit Area: 20% larger than display (display 8, hit 10) */}
                        <Circle
                            radius={10}
                            fill="transparent"
                            listening={true}
                        />
                        {/* Visual Peg */}
                        <Circle
                            radius={8}
                            fill="#555"
                            stroke="#333"
                            strokeWidth={1}
                            perfectDrawEnabled={false}
                            listening={false}
                        />
                    </Group>
                );
            })}
            {/* Render permanent lines with player-specific colors */}
            {lines.map((line, index) => {
                const startPos = axialToPixel(line.start.q, line.start.r);
                const endPos = axialToPixel(line.end.q, line.end.r);

                // Player 1 = Red (#ff6b6b), Player 2 = Cyan (#4ecdc4)
                const lineColor = line.player === 'player1' ? '#ff6b6b' : '#4ecdc4';

                return (
                    <Line
                        key={`line-${index}`}
                        points={[startPos.x, startPos.y, endPos.x, endPos.y]}
                        stroke={lineColor}
                        strokeWidth={3}
                        lineCap="round"
                        listening={false}
                        shadowColor={lineColor}
                        shadowBlur={5}
                    />
                );
            })}
        </Layer>
    );
};

export default StaticLayer;
