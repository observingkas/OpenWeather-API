Weather Dashboard
A modern weather application that allows users to search for weather conditions in different cities and view a 5-day forecast.

Features
Current Weather Display: View current temperature, humidity, and wind speed for any city
5-Day Forecast: See a 5-day weather forecast to plan ahead
Search History: Previously searched cities are saved for quick access
Responsive Design: Works on desktop and mobile devices


Technologies Used
Frontend: HTML, CSS, TypeScript, Vite
Backend: Node.js, Express.js
APIs: OpenWeather API for weather data
Database: Local storage for search history
Installation
Clone the repository:
git clone https://github.com/observingkas/OpenWeather-API.git

Install dependencies for both client and server:
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

Create a .env file in the server directory with your OpenWeather API key:
OPENWEATHER_API_KEY=your_api_key_here
PORT=3001

Usage
Start the server:
cd server
npm run dev

In a separate terminal, start the client:
cd client
npm run dev

Open your browser and navigate to http://localhost:3000

Enter a city name in the search box to view current weather and forecast

License
This project is licensed under the MIT License - see the LICENSE file for details.

Walkthrough Video:

https://app.screencastify.com/v3/watch/UGCgn5oBH3oy352GkS4z
