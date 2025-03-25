import { Request, Response } from "express";
import WeatherService from '../service/weatherService.js';

export const getWeather = async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;

    if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
    }

    console.log(`Fetching weather for city: ${city}`);
    const weatherData = await WeatherService.getWeatherForCity(city);
    return res.json(weatherData);
} catch (error) {
    console.error('Error in weather controller:', error);
    return res.status(500).json({
        message: 'Error fetching weather data',
        error: error instanceof Error ? error.message : String(error)
    });
}
};

export const getHistory = async (_req: Request, res: Response) => {
    try {
        return res.json([]);
    } catch (error) {
        console.error('Error fetching search history:', error);
        return res.status(500).json({
            message: 'Error fetching search history',
            error
        });
    }
};

