import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Landing from './Components/Landing';
import './App.css';
import VideoBackground from './Components/VideoBackground';
import Map from './components/Adithya Page/Map';
import RoutePlanner from './components/Adithya Page/Planner';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
