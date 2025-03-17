import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

//Define a City class with name and id properties

class City {
  id: string;
  name: string;
  timestamp: string;

  constructor(name: string, id: string = uuidv4()) {
    this.id = id;
    this.name = name;
    this.timestamp = new Date().toISOString();
  }
}

//Complete the HistoryService class

class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, '../../../server/db/searchHistory.json');
  }

  //Define a read method that reads from the searchHistory.json file

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error: any) {

      //If file doesn't exist or is empty, return empty array
      if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
        await this.write([]);
        return [];
      }
      throw error;
    }
  }

  //Define a write method that writes the updated cities array to the searchHistory.json file
  
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to history file:', error);
      throw error;
    }
  }

  //Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  //Define an addCity method that adds a city to the searchHistory.json file
  
  async addCity(cityName: string): Promise<City> {
    try {
      const cities = await this.read();
      
      //Check if city already exists in history
      
      const existingCity = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());
      
      if (existingCity) {
        
        // Return existing city without modifying history
        return existingCity;
      }
      
      //Create new city entry with unique ID
      
      const newCity = new City(cityName);
      
      //Add to history and save
      
      cities.push(newCity);
      await this.write(cities);
      
      return newCity;
    } catch (error) {
      console.error('Error adding city to history:', error);
      throw error;
    }
  }

  //BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  
  async removeCity(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const cities = await this.read();
      const filteredCities = cities.filter(city => city.id !== id);
      
      if (cities.length === filteredCities.length) {
        throw new Error('City not found');
      }
      
      await this.write(filteredCities);
      return { success: true, message: 'City deleted from history' };
    } catch (error: any) {
      console.error('Error removing city from history:', error.message);
      throw error;
    }
  }
}

export default new HistoryService();