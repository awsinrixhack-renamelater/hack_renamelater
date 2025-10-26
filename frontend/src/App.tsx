import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import Homepage from './pages/Homepage.tsx'
import Scoreboard from './pages/Scoreboard.tsx'
import SignIn from './pages/Signin.tsx'
import Welcome from './pages/Welcome.tsx'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/about" element={<Scoreboard />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
  </Router>
  )
}

export default App


