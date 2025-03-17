import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;

  constructor(
    cityName: string,
    date: string,
    icon: string,
    description: string,
    temperature: number,
    humidity: number,
    windSpeed: number
  ) {
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseURL: string;
  private geoURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = "https://api.openweathermap.org/data/2.5";
    this.geoURL = "https://api.openweathermap.org/geo/1.0/direct";
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await axios.get(this.buildGeocodeQuery(query));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching location data:", error.message);
      throw error;
    }
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error("City not found");
    }

    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.geoURL}?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(
    city: string
  ): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await axios.get(this.buildWeatherQuery(coordinates));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching weather data:", error.message);
      throw error;
    }
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { city, list } = response;
    const currentData = list[0];

    return new Weather(
      city.name,
      new Date(currentData.dt * 1000).toLocaleDateString(),
      currentData.weather[0].icon,
      currentData.weather[0].description,
      currentData.main.temp,
      currentData.main.humidity,
      currentData.wind.speed
    );
  }

  // Complete buildForecastArray method
  private buildForecastArray(
    currentWeather: Weather,
    weatherData: any[]
  ): Weather[] {
    const forecast: Weather[] = [];
    const uniqueDays = new Set<string>();

    // Start from index 1 to skip current day
    for (let i = 1; i < weatherData.length; i++) {
      const item = weatherData[i];
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString();

      // Only add one entry per day (around noon)
      if (
        !uniqueDays.has(day) &&
        date.getHours() >= 11 &&
        date.getHours() <= 13
      ) {
        uniqueDays.add(day);

        forecast.push(
          new Weather(
            currentWeather.cityName,
            day,
            item.weather[0].icon,
            item.weather[0].description,
            item.main.temp,
            item.main.humidity,
            item.wind.speed
          )
        );

        // Stop after 5 days
        if (forecast.length === 5) break;
      }
    }

    return forecast;
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherResponse = await this.fetchWeatherData(coordinates);

      const currentWeather = this.parseCurrentWeather(weatherResponse);
      const forecast = this.buildForecastArray(
        currentWeather,
        weatherResponse.list
      );

      return {
        current: currentWeather,
        forecast: forecast,
      };
    } catch (error: any) {
      console.error("Error getting weather for city:", error.message);
      throw error;
    }
  }
}

export default new WeatherService();
