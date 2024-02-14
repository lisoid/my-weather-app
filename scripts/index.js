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

  //Show weather forecast
  function showForecast(response) {
    console.log(response.data);

    let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
    let forecastHTML = "";

    days.forEach(function (day) {
      forecastHTML =
        forecastHTML +
        `
<div class="weather-forecast-day">
  <div class="weather-forecast-date">Thu</div>
  <div class="weather-forecast-icon">
    <img
      src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/clear-sky-day.png"
      alt=""
    />
  </div>
  <div class="weather-forecast-temperatures">
    <span class="weather-forecast-temp-max">18°</span>
    <span class="weather-forecast-temp-min">12°</span>
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
        alert(
          `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`
        );
      });
  }

  // get API response for daily weather
  function getForecastAPI(city) {
    let apiKey = "0daa30c42c0776b6ft149co23bec4055";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&unit=metric`;
    console.log(apiUrl);
    axios.get(apiUrl).then(showForecast);
  }

  let newCity = document.querySelector("#search-form");
  newCity.addEventListener("submit", onSubmit);
});
