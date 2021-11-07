import React, { useState, useRef } from "react";
import { kelvinToCelsius } from "../../Helpers/Helpers";
import classes from "./Weather.module.css";

const openWeatherKey = process.env.REACT_APP_API;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

const Weather = () => {
  // Grabs user input
  const inputCity = useRef();
  // Sets city
  const [location, setLocation] = useState("");
  // Sets api info
  const [weather, setWeather] = useState({});
  //Sets status of api request
  const [status, setStatus] = useState({});

  // Fetch data from api

  const currentWeather = async () => {
    const fetchWeather = async () => {
      const getInputCity = inputCity.current.value;

      setStatus({ type: "loading", message: "Loading..." });

      const response = await fetch(
        `${weatherUrl}?&q=${getInputCity}&appid=${openWeatherKey}`
      );

      if (!response.ok) {
        throw new Error("Cannot fetch current weather!");
      }

      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchWeather();
      setLocation(data.name);
      setWeather({
        temp: data.main.temp,
        description: data.weather[0].description,
        img: data.weather[0].icon,
      });
      setStatus({ type: "success", message: "Success!" });
    } catch (error) {
      setStatus({ type: "error", message: "Cannot find city!" });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    currentWeather();
    inputCity.current.value = "";
  };

  return (
    <section className={classes.weatherContainer}>
      <h2 className={classes.subtitle}>Search for weather in any city!</h2>
      <form onSubmit={submitHandler} className={classes.form}>
        <input type="text" placeholder="Enter a city" ref={inputCity} />
        <button className={classes.btn}>Search Weather</button>
        {(status.type === "error" || status.type === "loading") && (
          <p className={classes.status}>{status.message}</p>
        )}
      </form>
      {status.type === "success" && (
        <div className={classes.weatherTypeContainer}>
          <p className={classes.weather}>
            <span className={classes.weatherType}>City: </span>
            {location}
          </p>
          <p className={classes.weather}>
            <span className={classes.weatherType}>Temperature: </span>
            {`${kelvinToCelsius(weather.temp)}°C`}
          </p>
          <p className={classes.weather}>
            <span className={classes.weatherType}>Weather: </span>
            {weather.description}
          </p>
          <img
            className={classes.img}
            alt="weather icon"
            src={`https://openweathermap.org/img/wn/${weather.img}@2x.png`}
          />
        </div>
      )}
    </section>
  );
};

export default Weather;
