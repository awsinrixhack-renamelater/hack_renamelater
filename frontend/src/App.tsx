import { useState } from 'react'
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import Homepage from './pages/Homepage.tsx'
import Scoreboard from './pages/Scoreboard.tsx'
import SignIn from './pages/Signin.tsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />

        {/* this is for connecting Scoreboard with Homepage */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Scoreboard />} />
        
      </Routes>
    </Router>
  )
}

export default App


