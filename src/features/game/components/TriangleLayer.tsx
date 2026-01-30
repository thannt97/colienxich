import React from 'react';
import { Layer, Line, Circle } from 'react-konva';
import { useGameStore } from '../store/game-store';
import { axialToPixel } from '../logic/grid-utils';

const PLAYER_COLORS = {
    player1: '#ff6b6b', // Red for player 1
    player2: '#4ecdc4'  // Cyan for player 2
};

export const TriangleLayer: React.FC = () => {
    const triangles = useGameStore(state => state.triangles);

    // Count triangles by player for accessibility
    const player1TriangleCount = triangles.filter(t => t.player === 'player1').length;
    const player2TriangleCount = triangles.filter(t => t.player === 'player2').length;

    return (
        <Layer
            aria-label={`Game triangles: ${player1TriangleCount} red markers, ${player2TriangleCount} cyan markers`}
        >
            {triangles.map((triangle) => {
                const [v1, v2, v3] = triangle.vertices;

                // Convert axial coordinates to pixel coordinates
                const p1 = axialToPixel(v1.q, v1.r);
                const p2 = axialToPixel(v2.q, v2.r);
                const p3 = axialToPixel(v3.q, v3.r);

                // Calculate centroid (center of triangle) for marker placement
                const centerX = (p1.x + p2.x + p3.x) / 3;
                const centerY = (p1.y + p2.y + p3.y) / 3;

                // Marker color based on player
                const markerColor = PLAYER_COLORS[triangle.player];

                // Create unique key from triangle vertices (React best practice - don't use index)
                const triangleKey = `${v1.q},${v1.r}-${v2.q},${v2.r}-${v3.q},${v3.r}`;

                return (
                    <React.Fragment key={triangleKey}>
                        {/* Triangle outline (subtle) */}
                        <Line
                            points={[p1.x, p1.y, p2.x, p2.y, p3.x, p3.y]}
                            closed={true}
                            stroke="#ffffff"
                            strokeWidth={1}
                            opacity={0.2}
                            listening={false}
                        />
                        {/* Circle marker at center */}
                        <Circle
                            x={centerX}
                            y={centerY}
                            radius={8}
                            fill={markerColor}
                            stroke="#ffffff"
                            strokeWidth={2}
                            listening={false}
                            shadowColor={markerColor}
                            shadowBlur={8}
                            shadowOpacity={0.6}
                        />
                        {/* Inner white circle for "marked" effect */}
                        <Circle
                            x={centerX}
                            y={centerY}
                            radius={3}
                            fill="#ffffff"
                            listening={false}
                        />
                    </React.Fragment>
                );
            })}
        </Layer>
    );
};
