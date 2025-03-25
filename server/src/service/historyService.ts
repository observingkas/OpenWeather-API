import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HistoryService {
  private filePath: string;

  constructor() {
    // Fix the path to use __dirname
    this.filePath = path.join(__dirname, '../../db/searchHistory.json');
    
    // Create the directory and file if they don't exist
    this.initializeFile();
  }

  private initializeFile(): void {
    const dir = path.dirname(this.filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  async getSearchHistory(): Promise<string[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  async saveSearch(city: string): Promise<void> {
    try {
      const history = await this.getSearchHistory();
      
      // Don't add duplicates
      if (!history.includes(city)) {
        history.push(city);
        
        // Keep only the most recent 5 searches
        const recentHistory = history.slice(-5);
        
        await fs.promises.writeFile(
          this.filePath, 
          JSON.stringify(recentHistory)
        );
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
  }

  async removeCity(city: string): Promise<boolean> {
    try {
      const history = await this.getSearchHistory();
      
      // Find the index of the city in the history
      const index = history.indexOf(city);
      
      // If the city is not in the history, return false
      if (index === -1) {
        return false;
      }
      
      // Remove the city from the history
      history.splice(index, 1);
      
      // Save the updated history
      await fs.promises.writeFile(
        this.filePath, 
        JSON.stringify(history)
      );
      
      return true;
    } catch (error) {
      console.error('Error removing city from history:', error);
      return false;
    }
  }
}

export default new HistoryService();