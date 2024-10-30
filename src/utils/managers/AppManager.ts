import DateFormatter from '@app/utils/DateFormater';
import * as process from 'process';

/**
 * Manages application-wide configurations, including start time tracking.
 *
 * The `AppManager` class is designed to manage core settings and provide a consistent
 * way to retrieve the application’s start time in a specified format. This helps ensure
 * that all parts of the application have access to a unified start time, essential for
 * consistent logging, reporting, or timestamping.
 */
class AppManager {

    /**
     * Retrieves or sets the application start time in the specified format.
     * 
     * - If the `START_TIME` environment variable is not set, it initializes it using
     *   the current date and time in ISO format.
     * - The returned time is formatted according to the `format` parameter using
     *   the `DateFormatter` utility, ensuring flexible date formatting options.
     * 
     * @param {string} format - The desired date and time format string (default is "y-m-d H:m:s").
     *                          The `format` string uses symbols (like `y`, `m`, `d`, `H`, `m`, `s`) 
     *                          for year, month, day, hour, minute, and second, respectively.
     * 
     * @returns {string} - The formatted start time as a string. Defaults to "YYYY-MM-DD HH:mm:ss" 
     *                     if the provided format is invalid or unsupported.
     */
    public static getStartTime(format: string = "y-m-d H:m:s"): string {
        let startTime = process.env.START_TIME;

        if (!startTime) {
            const now = new DateFormatter();

            startTime = now.toISOString().slice(0, 19).replace('T', ' ');

            process.env.START_TIME = startTime;
        }

        const date = new DateFormatter(startTime);
        const formattedDate = date.format(format);

        if (typeof formattedDate === 'string') {
            return formattedDate;
        }
        return date.format("YYYY-MM-DD HH:mm:ss").toString();
    }
}

export default AppManager;
