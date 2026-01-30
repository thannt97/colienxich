---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-starter', 'step-04-decisions', 'step-05-patterns', 'step-06-structure', 'step-07-validation', 'step-08-complete']
inputDocuments: ['/home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/prd.md', '/home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/product-brief-cpx-qlnd-2026-01-29.md']
workflowType: 'architecture'
project_name: 'cpx-qlnd'
user_name: 'Thannv'
date: '2026-01-29'
status: 'complete'
completedAt: '2026-01-29'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
*   **Core Mechanics**: Turn-based hexagon game with physics-based interactions (drag/snap).
*   **Game Logic**: Geometric validation (triangle detection) and scoring rules.
*   **Modes**: Local vs Bot (Client-side AI).
*   **Architectural Implication**: Need a decoupled **Game Engine** that runs independently of the React View layer.

**Non-Functional Requirements:**
*   **Performance**: Strict 60FPS target. Must separate "Active Data" (animations) from "State Data" (scores/turns).
*   **Reliability**: Offline tolerance requires robust State Persistence (Zustand persist).
*   **Compatibility**: Responsive Canvas scaling for various mobile aspect ratios.

**Scale & Complexity:**
*   **Primary Domain**: Browser-based Casual Game.
*   **Complexity Level**: Medium (High interaction fidelity, low backend complexity).
*   **Estimated Components**: 5-8 major modules.

### Technical Constraints & Dependencies
*   **React + Canvas**: Must prevent React reconciliation from killing Canvas performance.
*   **Asset Size**: Strict <5MB limit restricts use of heavy engines or assets.

### Cross-Cutting Concerns Identified
*   **State Management**: Syncing Game Logic State <-> UI State.
*   **Input Handling**: Unified Touch/Mouse/Pointer events normalization.
*   **Audio/Haptics**: Global audit feedback system.

## Starter Template Evaluation

### Primary Technology Domain
*   **Web Application (SPA Game)**: Focus on Client-side logic & Canvas rendering.

### Selected Starter: Vite React TypeScript
*   **Rationale**: 
    *   **Performance**: Fast HMR for rapid game tuning.
    *   **Flexibility**: Clean slate for custom Canvas logic without Next.js SSR overhead.
    *   **Ecosystem**: Native support for Zustand & Konva.

**Initialization Command:**

```bash
npm create vite@latest cpx-qlnd -- --template react-ts
```

**Architectural Decisions Provided by Starter:**
*   **Language**: TypeScript (Strict mode enabled for logic safety).
*   **Build Tool**: Vite (Rollup for production).
*   **Testing**: Vitest (can be added manually, Vite-compatible).
*   **Structure**: `/src` based (Standard React structure).

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
*   **Directory Structure**: Feature-based organization.
*   **State Management**: Split strategy (UI vs Game State).
*   **Game Engine Loop**: Custom `requestAnimationFrame` hook.
*   **Canvas Layering**: Multi-layer optimization (Background/Static/Dynamic).

### Data Architecture
*   **Game State**: Mutable Ref Object for high-frequency updates (Performance optimization).
*   **Persistence**: `localStorage` via Zustand `persist` middleware.
*   **Validation**: Zod (for validating loaded state/config).

### Frontend Architecture
*   **Structure**: Feature-based (`src/features/game`, `src/shared`).
*   **State Management**: 
    *   **Zustand**: UI State (Score, Turn, Modals).
    *   **Refs/Context**: Game Loop State (Coordinates, Physics).
*   **Rendering**: `react-konva` for declarative Canvas management.

### Decision Impact Analysis
*   **Implementation Sequence**:
    1.  Setup Vite + Folder Structure.
    2.  Implement Game Loop Hook.
    3.  Build Canvas Layers (Static Grid first).
    4.  Implement Drag Physics.

## Implementation Patterns & Consistency Rules

### Naming Patterns
*   **Components**: PascalCase (e.g., `GameBoard.tsx`).
*   **Hooks**: camelCase starting with "use" (e.g., `useGameLoop.ts`).
*   **Files**: 
    *   React Components/Hook Files: Match component/hook name (`PascalCase.tsx` or `camelCase.ts`).
    *   Logic/Utils/Configuration: kebab-case (`triangle-detector.ts`).
*   **Variables/Functions**: camelCase.

### State & Data Flow Patterns
*   **Zustand (Meta State)**: Used for slow-changing metadata: scores, turns, game status (playing, gameover), and settings.
*   **Ref/Mutable (High-Frequency State)**: 
    *   All physics data (peg coordinates, current dragging line coordinates) must live in `useRef` or a non-React object.
    *   Update this data via `requestAnimationFrame`.
    *   Avoid React state for frame-by-frame updates to maintain 60FPS.

### Structure Patterns
*   **Feature-based Organization**: Co-locate implementation, business logic, and tests.
    *   `src/features/game/` - Core domain.
    *   `src/shared/` - Reusable UI/Hooks.
*   **Test Location**: Co-located in `__tests__` folders within the feature directory.

### Process Patterns
*   **Error Handling**: Geometric logic must be atomic. Use Unit Tests for precision validation.
*   **Loading State**: Use React Suspense for asset (Audio/Image) management.
*   **Input Normalization**: Centralize Pointer Events (Mouse/Touch/Pen) in a single service to ensure consistency across devices.

### Enforcement Guidelines
*   **Zero-Binding Framerate Policy**: AI agents must never bind high-frequency animation data to React State.
*   **Separation of Concerns**: Keep geometric detection algorithms separate from Rendering/View logic.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
cpx-qlnd/
├── public/                 # Static assets (sounds, PWA manifest, icons)
├── src/
│   ├── assets/             # Global CSS, Images, Fonts
│   ├── components/         # Shared UI Components (Button, Modal, Toast)
│   ├── features/
│   │   └── game/           # Core Game Feature
│   │       ├── components/ # Layered Canvas components
│   │       │   ├── StageContainer.tsx
│   │       │   ├── StaticLayer.tsx   # Render-once: Background + Pegs
│   │       │   └── DynamicLayer.tsx  # Dynamic: Dragging lines, animations
│   │       ├── hooks/      # Game-specific interactions
│   │       │   ├── useGameLoop.ts    # requestAnimationFrame orchestrator
│   │       │   └── useInteraction.ts # Input handling (Pointer events)
│   │       ├── logic/      # Pure business logic (Framework agnostic)
│   │       │   ├── triangle-detector.ts
│   │       │   ├── scoring.ts
│   │       │   └── grid-utils.ts
│   │       ├── ai/         # Bot logic
│   │       │   └── random-bot.ts
│   │       └── store/      # Zustand specific state
│   │           └── game-store.ts
│   ├── shared/             # Project-wide utilities
│   │   ├── events/         # Pointer event normalization
│   │   └── hooks/          # Reusable non-game hooks
│   ├── types/              # Global TypeScript interfaces/types
│   ├── App.tsx             # Main view layout
│   └── main.tsx            # Entry point
├── tests/                  # Integration & E2E tests (Playwright/Vitest)
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

### Architectural Boundaries

**Component Boundaries:**
*   **Decoupled Logic**: `src/features/game/logic/` must remain pure TS and must NOT import from React or Konva.
*   **State Unidirectional Flow**: Zustand store updates trigger UI changes, but 60FPS physics data flows from Refs -> Loop -> Canvas (Bypassing React Reconciliation).

**Data Boundaries:**
*   **Persistence**: Game state is serialized/deserialized in `game-store.ts` using `localStorage`.

### Requirements to Structure Mapping

**Feature Mapping:**
*   **Gameplay (FR-GAME)**: Handled by `DynamicLayer.tsx` & `triangle-detector.ts`.
*   **Bot AI (FR-AI)**: Managed in `features/game/ai/`.
*   **UI/Score (FR-UI)**: React components in `src/components/` bound to `game-store.ts`.

**Cross-Cutting Concerns:**
*   **Input Normalization**: `src/shared/events/` ensures mobile touch and desktop click behave identically.

## Architecture Validation Results

### Coherence Validation ✅
*   **Stack Harmony**: Vite + Zustand + react-konva work seamlessly. TypeScript provides safety for complex geometric logic.
*   **Pattern Consistency**: State split strategy aligns perfectly with the 60FPS NFR.
*   **Structure Alignment**: Feature-based directory organization supports clear boundaries between game engine and UI.

### Requirements Coverage Validation ✅
*   **Performance**: Fully addressed by the "Zero-Binding Framerate Policy" and multi-layer rendering.
*   **Functional (FR)**: Core mechanics and AI bots have dedicated architectural homes in the feature directory.
*   **User Journeys**: Responsive state management ensures immediate visual/audio feedback for actions.

### Gap Analysis Results
*   **Minor Gap**: Math library choice. *Resolved*: Stick to custom pure TS for MVP to minimize bundle size.
*   **Optimization**: Consider Offscreen Canvas for background rendering if mobile battery performance becomes an issue in the future.

### Architecture Readiness Assessment
*   **Overall Status**: **READY FOR IMPLEMENTATION**
*   **Confidence Level**: **High**
*   **Key Strengths**: Decoupled Engine, Multi-layer Canvas rendering, optimized input normalization.

### Implementation Handoff
*   **AI Agent Guidelines**:
    *   Initialize project using the selected Vite command.
    *   Strictly follow the "State Split" rule: No 60FPS data in Zustand.
    *   Maintain the pure TS nature of the logic folder.
