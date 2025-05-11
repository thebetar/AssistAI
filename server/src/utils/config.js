import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'files.db');

const DEFAULT_CONFIG = {
    chatModel: "gemma3:1b",
    embeddingModel: "mxbai-embed-large",
    temperature: 0.1,
    githubUrl: "",
    githubAccessToken: "",
    filesChecksum: null,
};

async function getDb() {
    const db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    `);
    return db;
}

export async function loadConfig() {
    const db = await getDb();
    const rows = await db.all('SELECT key, value FROM config');

    if (!rows.length) {
        // Insert default config
        for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
            await db.run('INSERT INTO config (key, value) VALUES (?, ?)', key, JSON.stringify(value));
        }
        return { ...DEFAULT_CONFIG };
    }

    const config = {};

    for (const row of rows) {
        try {
            config[row.key] = JSON.parse(row.value);
        } catch {
            config[row.key] = row.value;
        }
    }

    // Fill in any missing keys with defaults
    for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
        if (!(key in config)) config[key] = value;
    }

    return config;
}

export async function saveConfig(newConfig) {
    const db = await getDb();

    for (const [key, value] of Object.entries(newConfig)) {
        await db.run(
            'INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
            key,
            JSON.stringify(value)
        );
    }
}