"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const logger_1 = require("./utils/logger");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        const app = (0, app_1.createApp)();
        app.listen(PORT, () => {
            logger_1.logger.info(`Server listening on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
