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


    const iconCode = dailyForecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconUrl);

    iconEl.setAttribute('alt', dailyForecast.weather[0].description);


    const tempEl = document.createElement('p');
    tempEl.textContent = `Temp: ${Math.round(dailyForecast.main.temp)} °C`;


    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${dailyForecast.main.humidity}%`;


    card.append(dateEl, iconEl, tempEl, humidityEl);


    forecastContainerEl.append(card);
  }
}

async function fetchWeather(city) {


  try {

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;


    const responses = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);


    for (const response of responses) {
      if (!response.ok) {
        throw new Error('City not found or API error.');
      }
    }

    const [currentWeather, forecast] = await Promise.all(
      responses.map(response => response.json())
    );

    displayCurrentWeather(currentWeather);


    displayForecast(forecast.list);

  } catch (error) {

    console.error('Failed to fetch weather data:', error);
  }
}
