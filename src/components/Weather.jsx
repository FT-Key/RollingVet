import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ center = false, city = "Argentina" }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&lang=es`
        );
        setWeather(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const iconCode = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className={`${center && 'text-center'}`}>
      <h6>{weather.name}</h6>
      <h6>{Math.round(weather.main.temp)}°C</h6>
      <h6>{weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}</h6>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>Humedad: {weather.main.humidity}%</p>
    </div>
  );
};

export default Weather;