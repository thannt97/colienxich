// Debug script to check triangle detection
import { generateValidTriangles, detectNewTriangles } from './src/features/game/logic/triangle-detector.ts';

const VALID_TRIANGLES = generateValidTriangles(3);
console.log('Number of valid triangles for radius 3:', VALID_TRIANGLES.length);

// Test: Create a simple triangle with 3 adjacent pegs
const testLines = [
  { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
  { start: { q: 1, r: 0 }, end: { q: 0, r: 1 } },
  { start: { q: 0, r: 1 }, end: { q: 0, r: 0 } },
];

const detected = detectNewTriangles(testLines, 'player1', VALID_TRIANGLES);
console.log('Detected triangles:', detected.length);
console.log('Triangles:', JSON.stringify(detected, null, 2));
