//** Page for displaying current weather information and a multi-day forecast **//

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/WeatherPage.css';

const WeatherPage = () => {
  //** State for weather data, error messages, and loading state **//
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //** Fetch user's location and weather data on component mount **//
  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      setLoading(true);
      try {
        //** Call backend to retrieve approximate location **//
        const locationResponse = await axios.get('/api/location');
  
        const { description } = locationResponse.data;

        //** Fetch weather using the retrieved location description **//
        const weatherResponse = await axios.post('/api/weather', { location: description });

        //** Merge location into the weather data for display **//
        setWeather({ ...weatherResponse.data, location: description });
      } catch (err) {
        console.error('[ERROR] Failed to fetch weather information:', err.response?.data || err.message);
        setError('Failed to retrieve weather information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndWeather();
  }, []);

  //** Render the weather page content **//
  return (
    <div className="weather-page-container">
      <h1>Weather Information</h1>

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Error message */}
      {error && (
        <div className="weather-error">
          <p>{error}</p>
        </div>
      )}

      {/* Weather data display */}
      {weather && (
        <>
          <div className="current-weather">
            <h2>{weather.current.location || weather.location}</h2>
            <img src={weather.current.thumbnail} alt={weather.current.description} />
            <p>
              <strong>Temperature:</strong> {weather.current.temperature}
            </p>
            <p>
              <strong>Condition:</strong> {weather.current.description}
            </p>
            <p>
              <strong>Precipitation:</strong> {weather.current.precipitation}
            </p>
            <p>
              <strong>Humidity:</strong> {weather.current.humidity}
            </p>
            <p>
              <strong>Wind:</strong> {weather.current.wind}
            </p>
          </div>

          <div className="weather-forecast">
            <h3>Forecast</h3>
            <div className="forecast-cards">
              {weather.forecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <h4>{day.day}</h4>
                  <img src={day.thumbnail} alt={day.description} />
                  <p>
                    <strong>High:</strong> {day.high}° | <strong>Low:</strong> {day.low}°
                  </p>
                  <p>{day.description}</p>
                  <p>
                    <strong>Humidity:</strong> {day.humidity}
                  </p>
                  <p>
                    <strong>Precipitation:</strong> {day.precipitation}
                  </p>
                  <p>
                    <strong>Wind:</strong> {day.wind}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;
