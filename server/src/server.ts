import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath }  from 'url';

dotenv.config();

//Import routes
import routes from './routes/index';

//Set up __dirname in ES module scope

const ___filename = fileURLToPath(import.meta.url);
const ___dirname = path.dirname(___filename);

const app = express();
const port = process.env.PORT || 3001;

//Implement middleware for parsing JSON and urlencoded form data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve static files from the client dist folder in production or client folder in development

const clientPath = process.env.NODE_ENV === 'production'
? path.join(___dirname, '../../client', 'dist')
: path.join(___dirname, '../../client');

app.use(express.static(clientPath));

//Implement middleware to connect the routes

app.use(routes);

//Start the server on the port

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));