import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import Homepage from './pages/Homepage.tsx'
import Scoreboard from './pages/Scoreboard.tsx'
import Login from './pages/Login.tsx'
import Welcome from './pages/Welcome.tsx'

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to welcome page */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />

        {/* Main pages */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />

        {/* Optional: Example of linking Home and Scoreboard */}
        <Route path="/about" element={<Scoreboard />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  )
}

export default App
