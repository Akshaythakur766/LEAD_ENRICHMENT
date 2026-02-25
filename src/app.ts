import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import enrichRoutes from './routes/enrichRoutes';
import { connectRedis } from './cache/RedisCache';

export const createApp = (): Express => {
    const app = express();

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));

    // Request ID Middleware
    app.use((req, res, next) => {
        (req as any).id = crypto.randomUUID();
        next();
    });

    // Health check route
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Routes
    app.use('/', enrichRoutes);

    // 404 Handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Not Found' });
    });

    return app;
};
