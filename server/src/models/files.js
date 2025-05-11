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
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            return db;
        }).catch((error) => {
            console.error('[files] Error opening files database:', error);
        });
    }

    async getFiles(sort = false) {
        const db = await this.dbPromise;

        try {
            // Join files and tags, aggregate tags as array
            const rows = await db.all(`
                SELECT 
                    f.id, 
                    f.name, 
                    f.content, 
                    f.created_at,
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
                files = files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }

            return files;
        } catch (e) {
            console.error('[files] Error fetching files:', e);
            return [];
        }
    }

    async getFileContent(identifier) {
        const db = await this.dbPromise;

        try {
            const row = await db.get('SELECT content FROM files WHERE id = ?', identifier);

            return row ? row.content : null;
        } catch (e) {
            console.error('[files] Error fetching file content:', e);
            return null;
        }
    }

    async add(filename, content) {
        const db = await this.dbPromise;
        const id = uuidv4();

        try {
            await db.run('INSERT INTO files (id, name, content) VALUES (?, ?, ?)', id, filename, content);
            return { id, name: filename, content };
        } catch (e) {
            console.error('[files] Error adding file:', e);
            return null;
        }
    }

    async update(identifier, filename, content) {
        const db = await this.dbPromise;

        try {
            const row = await db.get('SELECT id FROM files WHERE id = ?', identifier);

            if (!row) {
                return null;
            }

            await db.run('UPDATE files SET name = ?, content = ? WHERE id = ?', filename, content, row.id);
            return { id: row.id, name: filename, content };
        } catch (e) {
            console.error('[files] Error updating file:', e);
            return null;
        }
    }

    async delete(identifier) {
        const db = await this.dbPromise;

        try {
            const row = await db.get('SELECT id, name FROM files WHERE id = ?', identifier);

            if (!row) {
                return null;
            }

            await db.run('DELETE FROM files WHERE id = ?', row.id);
            return row.name;
        } catch (e) {
            console.error('[files] Error deleting file:', e);
            return null;
        }
    }
}

export default FilesDataModel;