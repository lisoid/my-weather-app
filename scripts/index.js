document.addEventListener("DOMContentLoaded", (event) => {
  //show weather for default city
  getApi("KYIV");

  // Show current day and time
  function displayTime() {
    let date = new Date();

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

    let currentTime = document.querySelector("#time");
    currentTime.innerHTML = `${day} ${hour}:${minutes}`;
  }
  setInterval(displayTime, 1000); // update every second

  // Show weather for a city
  function showWeather(response) {
    document.querySelector("h1").innerHTML = response.data.city.toUpperCase();
    let currentTemperature = Math.round(response.data.temperature.current);
    document.querySelector("#currentTemperature").innerHTML =
      currentTemperature;
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

  // Sanitize city input
  function sanitizeCityInput(input) {
    return input.replace(/[@!^&\/\\#,+()$~%.'":*?<>{}]/g, "");
  }

  let newCity = document.querySelector("#search-form");
  newCity.addEventListener("submit", onSubmit);
});
