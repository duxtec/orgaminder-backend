import Config from '@app/utils/Config';
import AppManager from '@app/utils/managers/AppManager';
import * as fs from 'fs';
import * as path from 'path';
import winston from 'winston';

/**
 * Sets up and exports a Winston logger instance with customized configurations.
 *
 * This logger is configured to output logs in three locations:
 * - A specific timestamped directory for all logs, with `error.log` recording only error-level messages.
 * - `latest.log` file in the root directory, which resets on each application startup to show only the latest logs.
 * - The console, for immediate log visibility during development and debugging.
 *
 * The log directory is created dynamically based on the application's start time.
 * The log level and format are defined by application configuration.
 */

/**
 * Creates a directory for storing log files based on the application’s start time.
 * The directory path includes the year, month, day, hour, and minute of the start time.
 *
 * @returns {string} - The path of the created log directory.
 */
function createLogDirectory(): string {
    const startTime = AppManager.getStartTime("y-m-d/H:m");
    const dirPath = path.join(__dirname, "../..", 'logs', startTime);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    return dirPath;
}

const logDirectory = createLogDirectory();
const latestLogPath = path.join(logDirectory, '../..', 'latest.log');

/**
 * Winston logger instance configured with:
 * - `error.log` file in a timestamped directory for error-level logs.
 * - `latest.log` in the root directory, overwritten with each run.
 * - Console output for live log viewing.
 * 
 * The log level is set based on the application's environment configuration (`Config.LOG_LEVEL`),
 * and the output format is JSON for structured logs.
 */
const Logger = winston.createLogger({
    level: Config.LOG_LEVEL,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: path.join(logDirectory, 'error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: latestLogPath,
            options: { flags: 'w' },
        }),
        new winston.transports.Console(),
    ],
});

export default Logger;
