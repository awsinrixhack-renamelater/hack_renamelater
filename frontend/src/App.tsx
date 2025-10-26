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
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/welcome" element={<Welcome />} />

        <Route path="*" element={<Navigate to="/Login" replace />} />

        {/* this is for connecting Scoreboard with Homepage */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Scoreboard />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
  </Router>
  )
}

export default App


