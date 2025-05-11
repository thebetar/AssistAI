import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import simpleGit from 'simple-git';
import archiver from 'archiver';

import { BASE_PATH } from './utils/getPath.js';
import CustomDocumentChatModel, { DATA_DIR, DB_PATH } from './utils/model.js';
import { loadConfig, saveConfig } from './utils/config.js';
import FilesDataModel from './models/files.js';
import TagsDataModel from './models/tags.js';

const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/assets', express.static(path.join(BASE_PATH, 'client/assets/')));

// Serve static files for client (not dist)
app.use(express.static(path.join(BASE_PATH, 'client')));

// --- Config ---
const DATA_FILES_DIR = path.join(DATA_DIR, 'files');
const DATA_FILES_SYNC_DIR = path.join(DATA_DIR, 'github');

if (!fs.existsSync(DATA_FILES_DIR)) {
    fs.mkdirSync(DATA_FILES_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILES_SYNC_DIR)) {
    fs.mkdirSync(DATA_FILES_SYNC_DIR, { recursive: true });
}

const customDocumentChatModel = new CustomDocumentChatModel({
    refresh: false,
});
const tagsModel = new TagsDataModel(DB_PATH);
const filesModel = new FilesDataModel(DB_PATH);

// Load or create config
let config = await loadConfig();

// --- Utility ---
function getPendingStatus() {
    const lastDocumentchange = customDocumentChatModel.lastDocumentChange;
    const lastUpdated = customDocumentChatModel.lastUpdated;

    if (!lastDocumentchange && !lastUpdated) {
        return false;
    }

    if (lastDocumentchange && !lastUpdated) {
        return true;
    }

    if (lastDocumentchange > lastUpdated) {
        return true;
    }

    return false;
}

let syncFilesModel = null;

async function syncWithGithub(localFiles) {
    // Lazy init syncFilesModel
    if (!syncFilesModel) {
        syncFilesModel = FilesDataModel(DATA_FILES_SYNC_DIR);
    }

    const syncDirectory = DATA_FILES_SYNC_DIR;
    const repositoryUrl = (config.githubUrl || '').replace('https://', '');
    const accessToken = config.githubAccessToken || '';

    // Clone or pull repo
    let repo;
    if (!fs.existsSync(syncDirectory)) {
        await simpleGit().clone(
            `https://${encodeURIComponent(accessToken)}:x-oauth-basic@${repositoryUrl}`,
            syncDirectory,
        );
        repo = simpleGit(syncDirectory);
        await repo.checkout('master');
    } else {
        repo = simpleGit(syncDirectory);
        await repo.checkout('master');
        await repo.pull();
    }

    // Write all current local files to sync directory
    for (const localFile of localFiles) {
        const filename = localFile.name;
        const content = localFile.content;
        fs.writeFileSync(path.join(syncDirectory, filename), content, 'utf-8');
    }

    // Make checksum from sync folder
    const syncFiles = syncFilesModel.getFiles();
    const checksum = crypto.createHash('sha256').update(JSON.stringify(syncFiles)).digest('hex');

    // Compare checksum with current local file checksum
    if ('filesChecksum' in config && config.filesChecksum !== checksum) {
        // Sync from GitHub to local
        for (const syncFile of syncFiles) {
            const filename = syncFile.name;
            const content = syncFile.content;

            filesModel.add(filename, content);
        }
    }

    // Update checksum for next sync
    config.filesChecksum = checksum;

    // Commit and push changes
    await repo.add('.');

    try {
        await repo.commit('Sync with local changes');
    } catch (e) {
        // Ignore if nothing to commit
    }

    await repo.push();
}

// --- API Endpoints ---

app.get('/api/pending', (req, res) => {
    res.json({ pending: getPendingStatus() });
});

app.get('/api/history', (req, res) => {
    if (!customDocumentChatModel.history) {
        return res.status(404).json({ error: 'No chat history available' });
    }

    res.json({ history: customDocumentChatModel.history });
});

app.post('/api/question', async (req, res) => {
    const question = req.body.question || '';
    const use_rag = req.body.use_rag === 'on';
    const clear = req.body.clear === 'true';

    const response = await customDocumentChatModel.invoke(question, use_rag, clear);

    res.json({
        response,
        question,
        history: customDocumentChatModel.history,
        use_rag,
    });
});

// --- Files Management ---

app.get('/api/files', async (req, res) => {
    // Calculate checksum and sync logic
    let files = await filesModel.getFiles(true);

    // Check if the correct config is set to sync
    if (config.githubUrl && config.githubAccessToken) {
        const checksum = crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex');

        if ('filesChecksum' in config && config.filesChecksum !== checksum) {
            // Update checksum for use in next sync
            config.filesChecksum = checksum;

            // Sync using github url if provided (pushes and pulls changes)
            await syncWithGithub(files);

            // Get files again after sync
            files = await filesModel.getFiles();
        } else {
            config.filesChecksum = checksum;
        }

        // Write updated config to file
        await saveConfig(config);
    }

    res.json({ files });
});

app.post('/api/files', async (req, res) => {
    const { filename, content } = req.body;

    await filesModel.add(filename, content);
    customDocumentChatModel.lastDocumentChange = new Date();

    res.json({ success: true, filename });
});

app.post('/api/files/upload', upload.array('files'), async (req, res) => {
    for (const file of req.files) {
        await filesModel.add(file.originalname, file.buffer.toString('utf-8'));
    }

    customDocumentChatModel.lastDocumentChange = new Date();

    const updatedFiles = await filesModel.getFiles();
    res.json({ files: updatedFiles });
});

app.put('/api/files/:id', async (req, res) => {
    const fileId = req.params.id;
    const filename = req.body.filename;
    const content = req.body.content;

    await filesModel.update(fileId, filename, content);
    customDocumentChatModel.lastDocumentChange = new Date();
    res.json({ success: true, filename: filename });
});

app.delete('/api/files/:id', async (req, res) => {
    const fileId = req.params.id;

    await filesModel.delete(fileId);
    await tagsModel.removeFile(fileId);

    customDocumentChatModel.lastDocumentChange = new Date();
    const updatedFiles = await filesModel.getFiles();
    res.json({ files: updatedFiles });
});

app.post('/api/files/reload', async (req, res) => {
    customDocumentChatModel.loadModel();
    customDocumentChatModel.lastUpdated = new Date();

    const updatedFiles = await filesModel.getFiles();
    res.json({ files: updatedFiles });
});

app.post('/api/files/enrich', async (req, res) => {
    const content = req.body.content;
    const relatedFiles = req.body.relatedNotes || [];

    let relatedNotes = [];

    if (relatedFiles.length > 0) {
        for (const file of relatedFiles) {
            relatedNotes.push(await filesModel.getFileContent(file));
        }
    }

    const enrichedContent = await customDocumentChatModel.enrich(content, relatedNotes);
    res.json({ enrichedContent });
});

// --- Tags Management ---

app.get('/api/tags', async (req, res) => {
    const tags = await tagsModel.getTags();
    res.json(tags);
});

app.post('/api/tags/:id', async (req, res) => {
    const fileId = req.params.id;
    const tag = req.body.tag;

    await tagsModel.add(fileId, tag);

    const tags = await tagsModel.getTags();
    res.json({ tags });
});

app.delete('/api/tags/:id', async (req, res) => {
    const fileId = req.params.id;
    const tag = req.body.tag;

    await tagsModel.removeTag(fileId, tag);

    const tags = await tagsModel.getTags();
    res.json({ tags });
});

// --- Settings Management ---

app.get('/api/settings', async (req, res) => {
    config = await loadConfig();
    res.json(config);
});

app.put('/api/settings', async (req, res) => {
    const {
        chatModel = 'gemma3:1b',
        embeddingModel = 'gemma3:1b',
        temperature = 0.1,
        githubUrl = '',
        githubAccessToken = '',
    } = req.body;

    customDocumentChatModel.chatModel = chatModel;
    customDocumentChatModel.embeddingModel = embeddingModel;
    customDocumentChatModel.temperature = temperature;
    customDocumentChatModel.loadModel();

    // Reset checksum if githubUrl changed
    if (githubUrl !== config.githubUrl) {
        config.filesChecksum = null;
    }

    config = {
        chatModel,
        embeddingModel,
        temperature,
        githubUrl,
        githubAccessToken,
        filesChecksum: config.filesChecksum,
    };
    await saveConfig(config);
    res.json(config);
});

app.get('/api/export', async (req, res) => {
    const files = await filesModel.getFiles();

    // Clear the files directory
    const filesDir = path.join(DATA_DIR, 'files');
    const oldFiles = fs.readdirSync(filesDir);

    for (const file of oldFiles) {
        fs.unlinkSync(path.join(filesDir, file));
    }

    // Write all files to the directory
    for (const file of files) {
        const filename = file.name;
        const content = file.content;
        fs.writeFileSync(path.join(filesDir, `${filename}.md`), content, 'utf-8');
    }

    // Create a zip file
    const zipFilePath = path.join(DATA_DIR, 'files.zip');
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.directory(filesDir, false);
    archive.finalize();

    output.on('close', () => {
        res.download(zipFilePath, `files_${new Date().toISOString().slice(0, 10)}.zip`, err => {
            if (err) {
                console.error(err);
            }
            fs.unlinkSync(zipFilePath); // Delete the zip file after download
        });
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// --- Catch-all for client-side routing ---
app.use((req, res, next) => {
    const fullPath = req.path;

    if (fullPath.startsWith('/api/') || fullPath.startsWith('/assets/')) {
        return next();
    }

    // Serve index.html for SPA (from client/)
    res.sendFile(path.join(BASE_PATH, 'client/index.html'), err => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

// --- Start server ---
const PORT = process.env.PORT || 12345;

app.listen(PORT, () => {
    customDocumentChatModel.init();

    console.log(`Express server running on port ${PORT}`);
});
