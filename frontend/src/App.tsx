import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
<<<<<<< HEAD
import Homepage from './pages/Homepage.tsx'
import Scoreboard from './pages/Scoreboard.tsx'

=======
import Homepage from './pages/Homepage'
import SignIn from './pages/SignIn'
>>>>>>> e1a7d37 (add the homepage and signin)

function App() {
  const [count, setCount] = useState(0)

  return (
<<<<<<< HEAD
    <>
      <div>
          <Scoreboard/>
      </div>
    </>
=======
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
>>>>>>> e1a7d37 (add the homepage and signin)
  )
}

export default App

