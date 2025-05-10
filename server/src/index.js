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

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILES_DIR)) {
    fs.mkdirSync(DATA_FILES_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILES_SYNC_DIR)) {
    fs.mkdirSync(DATA_FILES_SYNC_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_TAG_FILE)) {
    fs.writeFileSync(DATA_TAG_FILE, JSON.stringify({}));
}

const customDocumentChatModel = new CustomDocumentChatModel({
    refresh: true
});
const tagsModel = new TagsDataModel(DATA_TAG_FILE);
const filesModel = new FilesDataModel(DATA_FILES_DIR, tagsModel);

// Load or create config
let config = loadConfig();


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
    const dataDirectory = DATA_FILES_DIR;
    const repositoryUrl = (config.githubUrl || '').replace('https://', '');
    const accessToken = config.githubAccessToken || '';

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
    if ('filesChecksum' in config && config.filesChecksum !== checksum) {
        // Sync from GitHub to local
        for (const syncFile of syncFiles) {
            const filename = syncFile.name;
            const content = syncFile.content;
            fs.writeFileSync(path.join(dataDirectory, filename), content, 'utf-8');
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
        return res.status(404).json({ error: "No chat history available" });
    }

    res.json({ history: customDocumentChatModel.history });
});

app.post('/api/question', async (req, res) => {
    const question = req.body.question || "";
    const use_rag = req.body.use_rag === "on";
    const clear = req.body.clear === "true";

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
    let files = filesModel.getFiles();

    // Check if the correct config is set to sync
    if (config.githubUrl && config.githubAccessToken) {
        const checksum = crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex');

        if ('filesChecksum' in config && config.filesChecksum !== checksum) {
            // Update checksum for use in next sync
            config.filesChecksum = checksum;

            // Sync using github url if provided
            await syncWithGithub(files);

            // Get files again after sync
            files = filesModel.getFiles();
        } else {
            config.filesChecksum = checksum;
        }

        // Write updated config to file
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    }

    res.json({ files });
});


app.post('/api/files', (req, res) => {
    const { filename, content } = req.body;

    filesModel.add(filename, content);
    customDocumentChatModel.lastDocumentChange = new Date();

    res.json({ success: true, filename });
});

app.post('/api/files/upload', upload.array('files'), (req, res) => {
    req.files.forEach(file => {
        filesModel.add(file.originalname, file.buffer);
    });

    customDocumentChatModel.lastDocumentChange = new Date();

    const updatedFiles = filesModel.getFiles();
    res.json({ files: updatedFiles });
});

app.put('/api/files/:filename', (req, res) => {
    const oldFilename = req.params.filename;
    const filename = req.body.filename;
    const content = req.body.content;

    filesModel.update(oldFilename, filename, content);
    customDocumentChatModel.lastDocumentChange = new Date();
    res.json({ success: true, filename: filename });
});

app.delete('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;

    filesModel.delete(filename);
    tagsModel.removeFile(filename);

    customDocumentChatModel.lastDocumentChange = new Date();
    const updatedFiles = filesModel.getFiles();
    res.json({ files: updatedFiles });
});

app.post('/api/files/reload', (req, res) => {
    customDocumentChatModel.loadModel();
    customDocumentChatModel.lastUpdated = new Date();

    const updatedFiles = filesModel.getFiles();
    res.json({ files: updatedFiles });
});

app.post('/api/files/enrich', async (req, res) => {
    const content = req.body.content;
    const relatedFiles = req.body.relatedNotes || [];

    let relatedNotes = [];

    if (relatedFiles.length > 0) {
        relatedNotes = relatedFiles.map(file => filesModel.getFileContent(file));
    }

    const enrichedContent = await customDocumentChatModel.enrich(content, relatedNotes);
    res.json({ enrichedContent });
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
            chatModel: customDocumentChatModel.chatModel,
            embeddingModel: customDocumentChatModel.embeddingModel,
            temperature: customDocumentChatModel.temperature,
            githubUrl: "",
            githubAccessToken: "",
        });
    }
    const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    res.json(data);
});

app.put('/api/settings', (req, res) => {
    const {
        chatModel = "gemma3:1b",
        embeddingModel = "gemma3:1b",
        temperature = 0.1,
        githubUrl = "",
        githubAccessToken = "",
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
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    res.json(config);
});

// --- Catch-all for client-side routing ---
app.use((req, res, next) => {
    const fullPath = req.path;
    if (fullPath.startsWith('/api/') || fullPath.startsWith('/assets/')) {
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
