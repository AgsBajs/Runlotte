import React from 'react'
import Card from './Card'
import Loader from './Loader'
import './Landing.css';
import Social from './Social'
import VideoBackground from './VideoBackground';
const Landing = () => {
  return (
    <div className= 'wrapper'>
      <h1 className='title'> RunLotte </h1>
      <Card />
      <Loader />
      <Social />
      <VideoBackground />
    </div>
    
    

    
  )
}

export default Landing