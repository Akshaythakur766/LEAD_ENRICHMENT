"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const enrichRoutes_1 = __importDefault(require("./routes/enrichRoutes"));
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)('dev'));
    // Request ID Middleware
    app.use((req, res, next) => {
        req.id = crypto.randomUUID();
        next();
    });
    // Health check route
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Routes
    app.use('/', enrichRoutes_1.default);
    // 404 Handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Not Found' });
    });
    return app;
};
exports.createApp = createApp;
