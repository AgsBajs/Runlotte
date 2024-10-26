import video from '../Components/snazzy-image.mp4';
import React from 'react';

const VideoBackground = () => {
  return (
    <video autoPlay loop muted style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: -1, 
    }}>
      <source src={video} autoPlay loop muted />
    
</video>
  );
};

export default VideoBackground;