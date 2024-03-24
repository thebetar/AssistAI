const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
	receiveChatData: callback => ipcRenderer.on('receive-chat-data', (event, message) => callback(message)),
	getChatData: () => ipcRenderer.send('get-chat-data'),
	sendChatData: message => ipcRenderer.send('send-chat-data', message),
	clearChatData: () => ipcRenderer.send('clear-chat-data'),
	receiveAccessData: callback => ipcRenderer.on('receive-access-data', (event, message) => callback(message)),
	getAccessData: () => ipcRenderer.send('get-access-data'),
	openAccessData: () => ipcRenderer.send('open-access-data'),
	waitForModel: callback => ipcRenderer.on('wait-for-model', () => callback()),
});
