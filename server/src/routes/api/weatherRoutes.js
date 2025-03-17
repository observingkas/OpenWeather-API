"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
    // TODO: GET weather data from city name
    // TODO: save city to search history
});
// TODO: GET search history
router.get('/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.default = router;
