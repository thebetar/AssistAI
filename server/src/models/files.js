import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

class FilesDataModel {
    constructor(dbPath, tagsModel) {
        this.tagsModel = tagsModel;
        this.dbPromise = open({
            filename: dbPath,
            driver: sqlite3.Database
        }).then(async (db) => {
            await db.exec(`
                CREATE TABLE IF NOT EXISTS files (
                    id TEXT PRIMARY KEY,
                    name TEXT UNIQUE,
                    content TEXT
                )
            `);
            return db;
        });
    }

    async getFiles(sort = false) {
        const db = await this.dbPromise;
        // Join files and tags, aggregate tags as array
        const rows = await db.all(`
            SELECT 
                f.id, 
                f.name, 
                f.content, 
                GROUP_CONCAT(t.tag, '|||') as tags
            FROM files f
            LEFT JOIN tags t ON t.file_id = f.id
            GROUP BY f.id
        `);
        let files = rows.map(row => ({
            id: row.id,
            name: row.name,
            content: row.content,
            tags: row.tags ? row.tags.split('|||') : []
        }));
        if (sort) {
            files = files.sort((a, b) => a.name.localeCompare(b.name));
        }
        return files;
    }

    async getFileContent(identifier) {
        const db = await this.dbPromise;
        let row;
        if (identifier.length === 36 && identifier.match(/^[0-9a-f-]+$/i)) {
            row = await db.get('SELECT content FROM files WHERE id = ?', identifier);
        } else {
            row = await db.get('SELECT content FROM files WHERE name = ?', identifier);
        }
        return row ? row.content : null;
    }

    async add(filename, content) {
        const db = await this.dbPromise;
        const id = uuidv4();
        try {
            await db.run('INSERT INTO files (id, name, content) VALUES (?, ?, ?)', id, filename, content);
            return { id, name: filename, content };
        } catch (e) {
            return null;
        }
    }

    async update(oldIdentifier, filename, content) {
        const db = await this.dbPromise;
        let row;
        if (oldIdentifier.length === 36 && oldIdentifier.match(/^[0-9a-f-]+$/i)) {
            row = await db.get('SELECT id FROM files WHERE id = ?', oldIdentifier);
        } else {
            row = await db.get('SELECT id FROM files WHERE name = ?', oldIdentifier);
        }
        if (!row) return null;
        await db.run('UPDATE files SET name = ?, content = ? WHERE id = ?', filename, content, row.id);
        return { id: row.id, name: filename, content };
    }

    async delete(identifier) {
        const db = await this.dbPromise;
        let row;
        if (identifier.length === 36 && identifier.match(/^[0-9a-f-]+$/i)) {
            row = await db.get('SELECT id, name FROM files WHERE id = ?', identifier);
        } else {
            row = await db.get('SELECT id, name FROM files WHERE name = ?', identifier);
        }
        if (!row) return null;
        await db.run('DELETE FROM files WHERE id = ?', row.id);
        return row.name;
    }
}

export default FilesDataModel;