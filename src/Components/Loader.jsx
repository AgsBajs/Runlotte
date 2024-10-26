import React from "react";
import styled from "styled-components";
import Weather from "../components/weather";
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'

const Loader = () => {
  //  // location info [lot, lat]
  //  const [location] = useState([-80.84309, 35.227207]); // Defined location as state
  //  const [temp, setTemp] = useState(null);

  //  useEffect(() => {
  //    // Retrieve temperature using Weather component
  //    const fetchWeather = async () => {
  //      try {
  //        const tempData = await Weather(location[1], location[0]); // Pass lat and lon to Weather
  //        setTemp(tempData);  // Store temperature in state
  //      } catch (error) {
  //        console.error("Error fetching temperature:", error);
  //      }
  //    };

  //    fetchWeather();
  //  }, [location]);

  return (
    <StyledWrapper>
      <div className="container">
        <div className="cloud front">
          <span className="left-front" />
          <span className="right-front" />
        </div>
        <span className="sun sunshine" />
        <span className="sun" />
        <div className="cloud back">
          <span className="left-back" />
          <span className="right-back" />
        </div>
        <p className="temp">59</p>
        {/* <p className="temp">{temp ? `${temp} °C` : "Loading..."}</p> */}

      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;  /* Fix the position relative to the viewport */
  top: 20px;      /* Distance from top of page */
  left: 20px;     /* Distance from left of page */

  .temp {
  font-size: 50px;
  font-weight: bold;
  z-index: 10;
  margin-top: 20px;
  margin-right: 15px;
  position: relative;
  left: 30px;
  }

  .container {
    width: 250px;
    height: 250px;
    padding: 15px;
    display: flex;
    position: relative;
    /* Removed align-items and justify-content as they're no longer needed */
  }

  .cloud {
    width: 100px;
  }

  .front {
    padding-top: 45px;
    margin-left: -50px;
    display: inline;
    position: absolute;
    z-index: 11;
    animation: clouds 8s infinite;
    animation-timing-function: ease-in-out;
  }

  .back {
    margin-top: -20px;
    margin-left: 70px;
    z-index: 12;
    animation: clouds 12s infinite;
    animation-timing-function: ease-in-out;
    position: absolute;
  }

  .right-front {
    width: 45px;
    height: 45px;
    border-radius: 50% 50% 50% 0%;
    background-color: #4c9beb;
    display: inline-block;
    margin-left: -25px;
    z-index: 5;
  }

  .left-front {
    width: 65px;
    height: 65px;
    border-radius: 50% 50% 0% 50%;
    background-color: #4c9beb;
    display: inline-block;
    z-index: 5;
  }

  .right-back {
    width: 50px;
    height: 50px;
    border-radius: 50% 50% 50% 0%;
    background-color: #4c9beb;
    display: inline-block;
    margin-left: -20px;
    z-index: 5;
  }

  .left-back {
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 0% 50%;
    background-color: #4c9beb;
    display: inline-block;
    z-index: 5;
  }

  .sun {
    width: 120px;
    height: 120px;
    background: linear-gradient(to right, #fcbb04, #fffc00);
    border-radius: 60px;
    display: inline;
    position: absolute;
    top: 15px;
    left: 15px;  /* Changed from right to left */
  }

  .sunshine {
    animation: sunshines 2s infinite;
  }

  @keyframes sunshines {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }

  @keyframes clouds {
    0% {
      transform: translateX(15px);
    }
    50% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(15px);
    }
  }
`;

export default Loader;