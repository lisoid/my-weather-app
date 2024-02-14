document.addEventListener("DOMContentLoaded", (event) => {
  //show weather for default city
  getApi("KYIV");

  //updates time every second
  setInterval(() => {
    let date = new Date();
    document.querySelector("#time").innerHTML = displayTime(date);
  }, 1000);

  // Show current day and time
  function displayTime(date) {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[date.getDay()];
    let hour = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${hour}:${minutes}`;
  }

  // Show weather for a city
  function showWeather(response) {
    document.querySelector("#current-city").innerHTML =
      response.data.city.toUpperCase();
    document.querySelector("#current-temperature").innerHTML = Math.round(
      response.data.temperature.current
    );
    document.querySelector("#description").innerHTML =
      response.data.condition.description;
    document.querySelector("#humidity").innerHTML =
      response.data.temperature.humidity + "%";
    document.querySelector("#wind").innerHTML =
      response.data.wind.speed + "km/h";

    document.querySelector("#weather-icon").innerHTML = `<img
        src="${response.data.condition.icon_url}"
        alt=""
      />`;

    getForecastAPI(response.data.city);
  }

  //format days (short version) for weather forecast
  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[date.getDay()];
  }

  //Show weather forecast
  function showForecast(response) {
    let forecastHTML = "";

    response.data.daily.slice(1, 6).forEach(function (day) {
      forecastHTML =
        forecastHTML +
        `
<div class="weather-forecast-day">
  <div class="weather-forecast-date">${formatDay(day.time)}</div>
  <div class="weather-forecast-icon">
    <img
      src="${day.condition.icon_url}"
      alt=""
    />
  </div>
  <div class="weather-forecast-temperatures">
    <span class="weather-forecast-temp-max"'>${Math.round(
      day.temperature.maximum
    )}°</span>
    <span class="weather-forecast-temp-min">${Math.round(
      day.temperature.minimum
    )}°</span>
  </div>
</div>`;
    });
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = forecastHTML;
  }

  // Search for a city
  function onSubmit(event) {
    event.preventDefault();
    let cityInput = document.querySelector("#search-bar");
    let city = sanitizeCityInput(
      document.querySelector("#search-bar").value
    ).trim();
    if (city.length) {
      getApi(city);
    }
    cityInput.value = "";
  }

  // Sanitize city input
  function sanitizeCityInput(input) {
    return input.replace(/[@!^&\/\\#,+()$~%.'":*?<>{}]/g, "");
  }

  // get API response for a city
  function getApi(city) {
    let apiKey = "0daa30c42c0776b6ft149co23bec4055";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&unit=metric`;

    axios
      .get(apiUrl)
      .then((response) => {
        if (response.data && response.data.city) {
          showWeather(response);
        } else {
          console.error("Error: City not found in the response data.");
          alert(`Error: The specified city "${city}" was not found.`);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert(`Please try again`);
      });
  }

  // get API response for daily weather
  function getForecastAPI(city) {
    let apiKey = "0daa30c42c0776b6ft149co23bec4055";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&unit=metric`;
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.data && response.data.city) {
          showForecast(response);
        } else {
          console.error("Error: Forecast not found in the response data.");
          alert(
            `Error: The forecast for specified city "${city}" was not found.`
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert(`Please try again`);
      });
  }

  let newCity = document.querySelector("#search-form");
  newCity.addEventListener("submit", onSubmit);
});
