import './styles/jass.css'; // This is fine, it's just a CSS import warning

// Define interfaces for our data
interface City {
  id: string;
  name: string;
  timestamp: string;
}

interface Weather {
  cityName: string;
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

interface WeatherResponse {
  city: City;
  weather: {
    current: Weather;
    forecast: Weather[];
  };
}

// All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*
API Calls
*/

const fetchWeather = async (city: string): Promise<WeatherResponse | undefined> => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }), // Changed from cityName to city to match our API
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData: WeatherResponse = await response.json();
    console.log('weatherData: ', weatherData);

    renderCurrentWeather(weatherData.weather.current);
    renderForecast(weatherData.weather.forecast);
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather:', error);
    alert('Failed to get weather data. Please try again.');
    return undefined;
  }
};

const fetchSearchHistory = async (): Promise<Response | undefined> => {
  try {
    const response = await fetch('/api/weather/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search history');
    }

    return response;
  } catch (error) {
    console.error('Error fetching history:', error);
    return undefined;
  }
};

const deleteCityFromHistory = async (id: string): Promise<Response | undefined> => {
  try {
    const response = await fetch(`/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete city');
    }

    return response;
  } catch (error) {
    console.error('Error deleting city:', error);
    alert('Failed to delete city. Please try again.');
    return undefined;
  }
};

/*
Render Functions
*/

const renderCurrentWeather = (currentWeather: Weather): void => {
  // Update to match our Weather interface
  const { cityName, date, icon, description, temperature, humidity, windSpeed } = currentWeather;

  heading.textContent = `${cityName} (${date})`;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', description);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${temperature}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: Weather[]): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  for (let i = 0; i < forecast.length; i++) {
    renderForecastCard(forecast[i]);
  }
};

const renderForecastCard = (forecast: Weather) => {
  // Update to match our Weather interface
  const { date, icon, description, temperature, humidity, windSpeed } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
    createForecastCard();

  // Add content to elements
  cardTitle.textContent = date;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', description);
  tempEl.textContent = `Temp: ${temperature} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async (searchHistory: Response): Promise<void> => {
  try {
    const historyList: City[] = await searchHistory.json();

    if (searchHistoryContainer) {
      searchHistoryContainer.innerHTML = '';

      if (!historyList.length) {
        searchHistoryContainer.innerHTML =
          '<p class="text-center">No Previous Search History</p>';
      }

      // Start at end of history array and count down to show the most recent cities at the top.
      for (let i = historyList.length - 1; i >= 0; i--) {
        const historyItem = buildHistoryListItem(historyList[i]);
        searchHistoryContainer.append(historyItem);
      }
    }
  } catch (error) {
    console.error('Error rendering search history:', error);
    if (searchHistoryContainer) {
      searchHistoryContainer.innerHTML = '<p class="text-center">Error loading search history</p>';
    }
  }
};

/*
Helper Functions
*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: City) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*
Event Handlers
*/

const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();

  if (!searchInput.value) {
    alert('City cannot be blank');
    return;
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search)?.then((data) => {
    if (data) getAndRenderHistory();
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.matches('.history-btn')) {
    const city = target.textContent;
    if (city) {
      fetchWeather(city)?.then((data) => {
        if (data) getAndRenderHistory();
      });
    }
  }
};

const handleDeleteHistoryClick = (event: Event) => {
  event.stopPropagation();
  const target = event.target as HTMLElement;
  const cityData = target.dataset.city;
  
  if (cityData) {
    const cityID = JSON.parse(cityData).id;
    deleteCityFromHistory(cityID)?.then((response) => {
      if (response) getAndRenderHistory();
    });
  }
};

/*
Initial Render
*/

const getAndRenderHistory = (): void => {
  fetchSearchHistory().then((response) => {
    if (response) renderSearchHistory(response);
  });
};

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();