import 'dotenv/config';
import { createApp } from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        const app = createApp();

        app.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
