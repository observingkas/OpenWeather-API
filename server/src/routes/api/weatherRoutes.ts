import { Router, Request, Response } from "express";
import HistoryService from "../../service/historyService";
import WeatherService from "../../service/weatherService";

const router = Router();

//POST Request with city name to retrieve weather data

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.body;

    if (!city) {
      res.status(400).json({ error: "City name is required" });
      return;
    }

    //GET weather data from city name

    const weatherData = await WeatherService.getWeatherForCity(city);

    //Save city to search history

    const cityRecord = await HistoryService.addCity(city);

    //Return both the city record and weather data

    res.json({
      city: cityRecord,
      weather: weatherData,
    });
  } catch (error: any) {
    console.error("Error in POST /api/weather:", error.message);
    res.status(500).json({ error: error.message });
  }
});

//GET search history

router.get("/history", async (_req: Request, res: Response): Promise<void> => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error: any) {
    console.error("Error in GET /api/weather/history:", error.message);
    res.status(500).json({ error: error.message });
  }
});

//BONUS: DELETE city from search history

router.delete(
  "/history/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await HistoryService.removeCity(id);
      res.json(result);
    } catch (error: any) {
      console.error("Error in DELETE /api/weather/history/:id:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
