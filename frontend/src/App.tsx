import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import Homepage from './pages/Homepage.tsx'
import Scoreboard from './pages/Scoreboard.tsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          <Scoreboard/>
      </div>
    </>
  )
}

export default App
