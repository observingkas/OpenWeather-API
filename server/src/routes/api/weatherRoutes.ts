import { Router, Request, Response } from 'express';
import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

const router = Router();

//Get search history 
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getSearchHistory();
    return res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ 
      message: 'Error fetching search history',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

//Delete from search history 
router.delete('/history/:city', async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    
    // Use our new removeCity method
    const success = await HistoryService.removeCity(city);
    
    if (success) {
      // If removal was successful, return the updated history
      const updatedHistory = await HistoryService.getSearchHistory();
      return res.json(updatedHistory);
    } else {
      // If removal failed, return a 404 error
      return res.status(404).json({ 
        message: 'City not found in search history'
      });
    }
  } catch (error) {
    console.error('Error deleting from history:', error);
    return res.status(500).json({ 
      message: 'Error deleting from search history',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

//Get weather for a city (query parameter)
router.get('/', async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    
    if (!city) {
      return res.status(400).json({ message: 'City parameter is required' });
    }
    
    //Save the search to history
    await HistoryService.saveSearch(city);
    
    //Get weather data
    const weatherData = await WeatherService.getWeatherForCity(city);
    return res.json({
      city: { id: city, name: city, timestamp: new Date().toISOString() },
      weather: weatherData
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ 
      message: 'Error fetching weather data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ message: 'City parameter is required in request body' });
    }
    
    console.log(`Processing POST request for city: ${city}`);
    
    //Save the search to history
    await HistoryService.saveSearch(city);
    
    //Get weather data
    const weatherData = await WeatherService.getWeatherForCity(city);
    return res.json({
      city: { id: city, name: city, timestamp: new Date().toISOString() },
      weather: weatherData
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ 
      message: 'Error fetching weather data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

//Get weather for a city (path parameter)
router.get('/:city', async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    
    //Save the search to history
    await HistoryService.saveSearch(city);
    
    //Get weather data
    const weatherData = await WeatherService.getWeatherForCity(city);
    return res.json({
      city: { id: city, name: city, timestamp: new Date().toISOString() },
      weather: weatherData
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ 
      message: 'Error fetching weather data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;