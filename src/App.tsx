import './App.css'
import StageContainer from './features/game/components/StageContainer'
import Dashboard from './features/game/components/Dashboard'
import { GameOverModal } from './features/game/components/GameOverModal'
import ModeSelection from './features/game/components/ModeSelection'

function App() {
    return (
        <div className="app-container">
            <ModeSelection />
            <Dashboard />
            <div id="game-container">
                <StageContainer />
            </div>
            <GameOverModal />
        </div>
    )
}

export default App
