import React, { useRef } from 'react';
import { Layer, Line } from 'react-konva';
import Konva from 'konva';
import { useGameLoop } from '../hooks/useGameLoop';
import { DragState } from '../hooks/useInteraction';

interface DynamicLayerProps {
    dragStateRef: React.MutableRefObject<DragState>;
}

const DynamicLayer: React.FC<DynamicLayerProps> = ({ dragStateRef }) => {
    const lineRef = useRef<Konva.Line>(null);

    useGameLoop(() => {
        if (!lineRef.current) return;

        const { isDragging, startX, startY, currentX, currentY } = dragStateRef.current;

        if (isDragging) {
            lineRef.current.visible(true);
            // Points are relative to the Layer/Stage. 
            // If the stage is centered at (width/2, height/2), 
            // and StaticLayer is also drawn relative to that center (0,0 is center),
            // then we need to ensure coordinate spaces match.

            // Assuming currentX/Y from stage.getPointerPosition() are in stage space.
            // If Stage has x,y set to center, then absolute 0,0 is top-left.
            // Konva nodes in a Layer with no offsets will use stage space.

            // We'll update the line points directly
            lineRef.current.points([startX, startY, currentX, currentY]);

            // Elastic effect: change opacity or strokeWidth based on length?
            const dx = currentX - startX;
            const dy = currentY - startY;
            const length = Math.sqrt(dx * dx + dy * dy);

            // Thinner as it stretches
            lineRef.current.strokeWidth(Math.max(2, 6 - length / 100));
        } else {
            lineRef.current.visible(false);
        }
    });

    return (
        <Layer>
            <Line
                ref={lineRef}
                stroke="#fff"
                strokeWidth={4}
                lineCap="round"
                lineJoin="round"
                visible={false}
                dash={[10, 5]}
                opacity={0.8}
                shadowColor="#fff"
                shadowBlur={10}
            />
        </Layer>
    );
};

export default DynamicLayer;
