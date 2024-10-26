import React, { useState, useEffect } from 'react';

const Weather = () => {
    const [data, setData] = useState({});
    const [latitude, setLat] = useState('');
    const [longitude, setLot] = useState('');

    useEffect(() => {
        if (latitude && longitude) {
            const fetchWeatherData = async () => {
                try {
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3de7efcab1d779a860b3887b098d516d`);
                    const result = await response.json();
                    setData(result);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            };
            fetchWeatherData();
        }
    }, [latitude, longitude]);

    const getTemp = () => data.main?.temp;
    const getHumidity = () => data.main?.humidity;
    const getWeatherDescription = () => data.weather?.[0]?.description;
    const getWeatherIcon = () => data.weather?.[0]?.icon;

    return (
        <div>
            <h2>Weather</h2>
            <p>Temperature: {getTemp()} °C</p>
            <p>Humidity: {getHumidity()}%</p>
            <p>Description: {getWeatherDescription()}</p>
            {getWeatherIcon() && <img src={`http://openweathermap.org/img/w/${getWeatherIcon()}.png`} alt="Weather icon" />}
        </div>
    );
};

export default Weather;
// //ex: https://api.openweathermap.org/data/2.5/weather?lat=35.227207&lon=-80.84309&appid=3de7efcab1d779a860b3887b098d516d

/*
const seaerchLocation = () => {
  axios.get(url).then((response)) = {
    setData(response.data)
    console.log(response.data)
  })
  }
*/