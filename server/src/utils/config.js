import fs from 'fs';
import path from 'path';

import { BASE_PATH } from './getPath.js';

const CONFIG_PATH = path.join(BASE_PATH, 'config.json');

export function loadConfig() {
    let config;

    if (!fs.existsSync(CONFIG_PATH)) {
        config = {
            chat_model: "gemma3:1b",
            embedding_model: "mxbai-embed-large",
            temperature: 0.1,
            github_url: "",
            github_access_token: "",
        };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    } else {
        config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }

    return config;
}