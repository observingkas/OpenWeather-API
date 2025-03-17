"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
// Import the routes
const index_js_1 = __importDefault(require("./routes/index.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// TODO: Serve static files of entire client dist folder
// TODO: Implement middleware for parsing JSON and urlencoded form data
// TODO: Implement middleware to connect the routes
app.use(index_js_1.default);
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
