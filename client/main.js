const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { invokeModel } = require('./chat');

const indexFile = path.join(__dirname, 'index.html');

function createWindow() {
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
		const response = await invokeModel(message);

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

	mainWindow.loadFile(indexFile);
}

function handleGetChatData(event) {
	const dataStr = fs.readFileSync(path.join(__dirname, 'data', 'chat.json'));
	const data = JSON.parse(dataStr);

	event.reply('receive-chat-data', data);
}

function getFiles() {
	const filesDirPath = path.join(__dirname, 'data', 'files');

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
