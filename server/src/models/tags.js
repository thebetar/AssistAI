import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'files.db');

class TagsDataModel {
    constructor() {
        this.dbPromise = open({
            filename: DB_PATH,
            driver: sqlite3.Database
        }).then(async (db) => {
            await db.exec(`
                CREATE TABLE IF NOT EXISTS tags (
                    id TEXT PRIMARY KEY,
                    file_id TEXT,
                    tag TEXT,
                    FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE
                )
            `);
            return db;
        });
    }

    async getTags() {
        const db = await this.dbPromise;
        const rows = await db.all(`
            SELECT f.name as filename, t.tag
            FROM tags t
            JOIN files f ON t.file_id = f.id
        `);
        const tags = {};
        for (const row of rows) {
            if (!tags[row.filename]) tags[row.filename] = [];
            tags[row.filename].push(row.tag);
        }
        return tags;
    }

    async getTagsForFile(fileIdentifier) {
        const db = await this.dbPromise;
        let fileRow;
        if (fileIdentifier.length === 36 && fileIdentifier.match(/^[0-9a-f-]+$/i)) {
            fileRow = await db.get('SELECT id FROM files WHERE id = ?', fileIdentifier);
        } else {
            fileRow = await db.get('SELECT id FROM files WHERE name = ?', fileIdentifier);
        }
        if (!fileRow) return [];
        const rows = await db.all('SELECT tag FROM tags WHERE file_id = ?', fileRow.id);
        return rows.map(r => r.tag);
    }

    async add(fileIdentifier, tag) {
        const db = await this.dbPromise;
        let fileRow;
        if (fileIdentifier.length === 36 && fileIdentifier.match(/^[0-9a-f-]+$/i)) {
            fileRow = await db.get('SELECT id FROM files WHERE id = ?', fileIdentifier);
        } else {
            fileRow = await db.get('SELECT id FROM files WHERE name = ?', fileIdentifier);
        }
        if (!fileRow) return;
        await db.run('INSERT INTO tags (id, file_id, tag) VALUES (?, ?, ?)', uuidv4(), fileRow.id, tag);
    }

    async removeFile(fileIdentifier) {
        const db = await this.dbPromise;
        let fileRow;
        if (fileIdentifier.length === 36 && fileIdentifier.match(/^[0-9a-f-]+$/i)) {
            fileRow = await db.get('SELECT id FROM files WHERE id = ?', fileIdentifier);
        } else {
            fileRow = await db.get('SELECT id FROM files WHERE name = ?', fileIdentifier);
        }
        if (!fileRow) return;
        await db.run('DELETE FROM tags WHERE file_id = ?', fileRow.id);
    }

    async removeTag(fileIdentifier, tag) {
        const db = await this.dbPromise;
        let fileRow;
        if (fileIdentifier.length === 36 && fileIdentifier.match(/^[0-9a-f-]+$/i)) {
            fileRow = await db.get('SELECT id FROM files WHERE id = ?', fileIdentifier);
        } else {
            fileRow = await db.get('SELECT id FROM files WHERE name = ?', fileIdentifier);
        }
        if (!fileRow) return;
        await db.run('DELETE FROM tags WHERE file_id = ? AND tag = ?', fileRow.id, tag);
    }
}

export default TagsDataModel;