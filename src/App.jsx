import { useState } from 'react'
import Login from './components/LoginPage/Login'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Login />
      </div>
    </>
  )
}

export default App
