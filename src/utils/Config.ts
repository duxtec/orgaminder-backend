import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

/**
 * Loads environment variables from `.env` files in the specified folder.
 * 
 * This function scans the given folder for `.env` files and loads them
 * using dotenv, excluding specific environment files (`production.env` 
 * and `development.env`). Additionally, it loads environment variables 
 * based on the current NODE_ENV setting (either `production` or `development`).
 *
 * @param {string} folder - Relative path to the folder containing `.env` files.
 */
const loadEnvFiles = (folder: string) => {
    folder = path.join(__dirname, folder);
    const files = fs.readdirSync(folder);
    const ignoreFiles = ['production.env', 'development.env'];
    const environment = process.env.NODE_ENV || 'development';

    files.forEach(file => {
        if (file.endsWith('.env') && !ignoreFiles.includes(file)) {
            dotenv.config({ path: path.join(folder, file) });
        }
    });

    dotenv.config({ path: path.join(folder, `${environment}.env`) });
};

// Load environment variables from the '../configs' directory
loadEnvFiles('../configs');

// Export environment variables as Config
const Config = { ...process.env };

export default Config;
