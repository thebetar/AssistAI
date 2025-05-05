import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import simpleGit from 'simple-git';

import CustomDocumentChatModel, { DATA_DIR, DATA_FILES_DIR } from './utils/model.js';
import FilesDataModel from './models/files.js';
import TagsDataModel from './models/tags.js';
import { loadConfig } from './utils/config.js';
import { BASE_PATH } from './utils/getPath.js';

const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/assets', express.static(path.join(BASE_PATH, 'client/assets/')));

// --- Config ---
const CONFIG_PATH = path.join(BASE_PATH, 'config.json');
const DATA_TAG_FILE = path.join(DATA_DIR, 'tags.json');
const DATA_FILES_SYNC_DIR = path.join(DATA_DIR, 'github');

const customDocumentChatModel = new CustomDocumentChatModel();
const tagsModel = new TagsDataModel(DATA_TAG_FILE);
const filesModel = new FilesDataModel(DATA_FILES_DIR, tagsModel);

// Load or create config
let config = loadConfig();


// --- Utility ---
function get_pending_status() {
    const last_document_change = customDocumentChatModel.last_document_change;
    const last_updated = customDocumentChatModel.last_updated;

    if (!last_document_change && !last_updated) {
        return false;
    }

    if (last_document_change && !last_updated) {
        return true;
    }

    if (last_document_change > last_updated) {
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
    const dataDirectory = DATA_FILES_DIR;
    const repositoryUrl = (config.github_url || '').replace('https://', '');
    const accessToken = config.github_access_token || '';

    // Clone or pull repo
    let repo;
    if (!fs.existsSync(syncDirectory)) {
        await simpleGit().clone(
            `https://${encodeURIComponent(accessToken)}:x-oauth-basic@${repositoryUrl}`,
            syncDirectory
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
    if ('files_checksum' in config && config.files_checksum !== checksum) {
        // Sync from GitHub to local
        for (const syncFile of syncFiles) {
            const filename = syncFile.name;
            const content = syncFile.content;
            fs.writeFileSync(path.join(dataDirectory, filename), content, 'utf-8');
        }
    }

    // Update checksum for next sync
    config.files_checksum = checksum;

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
    res.json({ pending: get_pending_status() });
});

app.get('/api/history', (req, res) => {
    if (!customDocumentChatModel.history) {
        return res.status(404).json({ error: "No chat history available" });
    }

    res.json({ history: customDocumentChatModel.history });
});

app.post('/api/question', (req, res) => {
    const question = req.body.question || "";
    const use_rag = req.body.use_rag === "on";
    const clear = req.body.clear === "true";

    const response = customDocumentChatModel.invoke(question, use_rag, clear);

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
    let files = filesModel.getFiles();

    // Check if the correct config is set to sync
    if (config.github_url && config.github_access_token) {
        const checksum = crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex');

        if ('files_checksum' in config && config.files_checksum !== checksum) {
            // Update checksum for use in next sync
            config.files_checksum = checksum;

            // Sync using github url if provided
            await syncWithGithub(files);

            // Get files again after sync
            files = filesModel.getFiles();
        } else {
            config.files_checksum = checksum;
        }

        // Write updated config to file
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    }

    res.json({ files });
});


app.post('/api/files', (req, res) => {
    const { filename, content } = req.body;

    filesModel.add(filename, content);
    customDocumentChatModel.last_document_change = new Date();

    res.json({ success: true, filename });
});

app.post('/api/files/upload', upload.array('files'), (req, res) => {
    req.files.forEach(file => {
        filesModel.add(file.originalname, file.buffer);
    });

    customDocumentChatModel.last_document_change = new Date();

    const updated_files = filesModel.getFiles();
    res.json({ files: updated_files });
});

app.put('/api/files/:filename', (req, res) => {
    const oldFilename = req.params.filename;
    const filename = req.body.filename;
    const content = req.body.content;

    filesModel.update(oldFilename, filename, content);
    customDocumentChatModel.last_document_change = new Date();
    res.json({ success: true, filename: filename });
});

app.delete('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;

    filesModel.delete(filename);
    tagsModel.removeFile(filename);

    customDocumentChatModel.last_document_change = new Date();
    const updated_files = filesModel.getFiles();
    res.json({ files: updated_files });
});

app.post('/api/files/reload', (req, res) => {
    customDocumentChatModel.loadModel();
    customDocumentChatModel.last_updated = new Date();

    const updated_files = filesModel.getFiles();
    res.json({ files: updated_files });
});

// --- Tags Management ---

app.get('/api/tags', (req, res) => {
    const tags = tagsModel.getTags();
    res.json(tags);
});

app.post('/api/tags/:item', (req, res) => {
    const item = req.params.item;
    const tag = req.body.tag;

    tagsModel.add(item, tag);

    const tags = tagsModel.getTags();
    res.json({ tags });
});

app.delete('/api/tags/:item', (req, res) => {
    const item = req.params.item;
    const tag = req.body.tag;

    tagsModel.removeTag(item, tag);

    const tags = tagsModel.getTags();
    res.json({ tags });
});

// --- Settings Management ---

app.get('/api/settings', (req, res) => {
    if (!fs.existsSync(CONFIG_PATH)) {
        return res.json({
            chat_model: customDocumentChatModel.chat_model,
            embedding_model: customDocumentChatModel.embedding_model,
            temperature: customDocumentChatModel.temperature,
            github_url: "",
            github_access_token: "",
        });
    }
    const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    res.json(data);
});

app.put('/api/settings', (req, res) => {
    const {
        chat_model = "gemma3:1b",
        embedding_model = "gemma3:1b",
        temperature = 0.1,
        github_url = "",
        github_access_token = "",
    } = req.body;

    customDocumentChatModel.chat_model = chat_model;
    customDocumentChatModel.embedding_model = embedding_model;
    customDocumentChatModel.temperature = temperature;
    customDocumentChatModel.load_model();

    // Reset checksum if github_url changed
    if (github_url !== config.github_url) {
        config.files_checksum = null;
    }

    config = {
        chat_model,
        embedding_model,
        temperature,
        github_url,
        github_access_token,
        files_checksum: config.files_checksum,
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    res.json(config);
});

// --- Catch-all for client-side routing ---
app.use((req, res, next) => {
    const full_path = req.path;
    if (full_path.startsWith('/api/') || full_path.startsWith('/assets/')) {
        return next();
    }
    // Serve index.html for SPA
    res.sendFile(path.join(BASE_PATH, 'client/index.html'), (err) => {
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
