const apiKey = "b66d3ddd5db9fda66597b74eba25f7f5"
const forecastContainerEl = document.getElementById('cards');
const cityNameEl = document.getElementById('cityName');
const temperatureEl = document.getElementById('temprature');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const searchFormEl = document.getElementById('search');
const searchInputEl = document.getElementById('searchInput');

searchFormEl.addEventListener('click', (event) => {
    event.preventDefault();
    const city = searchInputEl.value.trim();
     if (city) {
    console.log(`Input is valid. Ready to fetch weather for ${city}.`);
    fetchWeather(city);
  } else {
    console.log('Input is empty. Please enter a city name.');
  }
});

function displayCurrentWeather(data) {
  const currentDate = new Date().toLocaleDateString();
  
  cityNameEl.innerHTML = `<b>City Name</b>: ${data.name} (${currentDate})`;

  temperatureEl.innerHTML = `<b>Temperature</b>: ${Math.round(data.main.temp)}`;

  humidityEl.innerHTML = `<b>Humidity</b>: ${data.main.humidity}`;

  windSpeedEl.innerHTML = `<b>Wind Speed</b>: ${data.wind.speed}`;

}


function displayForecast(forecastList) {
    forecastContainerEl.innerHTML = '';

  for (let i = 0; i < forecastList.length; i += 8) {

    const dailyForecast = forecastList[i];
    const card = document.createElement('div');

    card.classList.add('forecast-card');
    const date = new Date(dailyForecast.dt_txt);
    const dateEl = document.createElement('h3');
    dateEl.textContent = date.toLocaleDateString();

    // 2. Create the weather icon element (img).
    // The API provides an icon code in `dailyForecast.weather[0].icon`.
    // We use this to build the full URL to the weather icon image.
    const iconCode = dailyForecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconUrl);
    // CRITICAL for accessibility: The alt attribute describes the image for screen readers
    // or if the image fails to load.
    iconEl.setAttribute('alt', dailyForecast.weather[0].description);

    // 3. Create the temperature element (p).
    // We round the temperature and add the unit symbol.
    const tempEl = document.createElement('p');
    tempEl.textContent = `Temp: ${Math.round(dailyForecast.main.temp)} °C`;

    // 4. Create the humidity element (p).
    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${dailyForecast.main.humidity}%`;

    // 5. Append all the newly created child elements to the parent `card` div.
    // The `.append()` method can take multiple elements at once.
    card.append(dateEl, iconEl, tempEl, humidityEl);

    // Let's log the fully assembled card to see the result in the console.
    // It should now be a div containing an h3, img, and two p tags.
    forecastContainerEl.append(card);
  }
}

async function fetchWeather(city) {

// Reference for the container where we will dynamically create and add the 5-day forecast cards.
  try {
    // Construct the two API URLs for current weather and forecast.
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Use Promise.all to fetch both sets of data concurrently for efficiency.
    const responses = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    // Check if any of the responses were not successful.
    for (const response of responses) {
      if (!response.ok) {
        throw new Error('City not found or API error.');
      }
    }

    // Use Promise.all again to parse both JSON bodies concurrently.
    // We use array destructuring to assign the results to named constants.
    const [currentWeather, forecast] = await Promise.all(
      responses.map(response => response.json())
    );

    // --- THIS IS THE FINAL CONNECTION ---
    // The data has been successfully fetched and parsed. Now, we call our
    // dedicated display functions to update the UI.

    // 1. Call the function to display the current weather, passing it the `currentWeather` object.
    displayCurrentWeather(currentWeather);

    // 2. Call the function to display the forecast, passing it the `list` array from the `forecast` object.
    displayForecast(forecast.list);

  } catch (error) {
    // If any part of the `try` block fails, this catch block will handle the error gracefully.
    console.error('Failed to fetch weather data:', error);
  }
}