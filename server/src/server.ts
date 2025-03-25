import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

//Load environment variables
dotenv.config();

// Test environment variables
console.log("Environment variables loaded:");
console.log(`PORT: ${process.env.PORT || '3002 (default)'}`);
console.log(`OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? 'Set' : 'Not set'}`);

//Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3002;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}

//Use routes
app.use(routes);

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;