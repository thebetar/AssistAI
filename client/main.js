const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { CustomDocumentModel } = require('./chat/chat');
const { marked } = require('marked');

const indexFile = path.join(__dirname, 'src/index.html');

function createWindow() {
	const customDocumentModel = new CustomDocumentModel();

	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	ipcMain.on('get-chat-data', handleGetChatData);
	ipcMain.on('get-access-data', handleGetAccessData);
	ipcMain.on('send-chat-data', async (event, message) => {
		// Retrieval chain is not ready yet
		if (!customDocumentModel.retrievalChain) {
			event.reply('wait-for-model');
			return;
		}

		console.log(`[main] Message sent ${message}`);

		const response = await customDocumentModel.invoke(message);

		const dataStr = fs.readFileSync(path.join(__dirname, 'data', 'chat.json'));
		const data = JSON.parse(dataStr);

		data.unshift({
			question: message,
			answer: response,
		});

		fs.writeFileSync(path.join(__dirname, 'data', 'chat.json'), JSON.stringify(data));

		handleGetChatData(event);
	});
	ipcMain.on('clear-chat-data', event => {
		fs.writeFileSync(path.join(__dirname, 'data', 'chat.json'), '[]');

		handleGetChatData(event);
	});
	ipcMain.on('open-access-data', event => {
		const filesDirPath = path.join(__dirname, '..', 'src', 'data', 'files');

		shell.openPath(filesDirPath);
	});

	mainWindow.loadFile(indexFile);
}

function handleGetChatData(event) {
	const dataStr = fs.readFileSync(path.join(__dirname, 'data', 'chat.json'));
	const data = JSON.parse(dataStr);

	event.reply(
		'receive-chat-data',
		data.map(item => ({
			...item,
			answer: marked.parse(item.answer),
		})),
	);
}

function getFiles() {
	const filesDirPath = path.join(__dirname, '..', 'src', 'data', 'files');

	const result = fs.readdirSync(filesDirPath);
	const files = [];

	while (result.length > 0) {
		const item = result.pop();
		const itemPath = path.join(filesDirPath, item);
		const stat = fs.statSync(itemPath);

		if (stat.isDirectory()) {
			result.push(...fs.readdirSync(itemPath).map(dir => path.join(item, dir)));
		} else {
			files.push(item);
		}
	}

	return files;
}

function handleGetAccessData(event) {
	const files = getFiles();

	event.reply('receive-access-data', files);
}

app.whenReady().then(() => {
	createWindow();

	// For MacOS bug
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});
