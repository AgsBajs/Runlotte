import { useState } from 'react'
import Landing from './Components/Landing'
import './App.css'
import VideoBackground from './Components/VideoBackground'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Landing />
        < VideoBackground />
      </div>
    </>
  )
}

export default App
