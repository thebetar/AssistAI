import path from 'path';
import { fileURLToPath } from 'url';

export function getBasePath() {
    // Convert import.meta.url to a file system path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return path.join(__dirname, '..', '..');
}

export const BASE_PATH = getBasePath();