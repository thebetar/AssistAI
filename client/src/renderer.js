const chatSendButton = document.getElementById('chat-send');
const chatSendButtonText = chatSendButton.querySelector('#chat-send-text');
const chatSendButtonLoader = chatSendButton.querySelector('#chat-send-loader');

let loadingInterval = null;
let loadingCounter = 0;

function setClickEvent(id, func) {
	document.getElementById(id).addEventListener('click', func);
}

function sendMessage() {
	const chatInput = document.getElementById('chat-input');
	const message = chatInput.value;

	if (message.length === 0) {
		return;
	}

	chatSendButton.disabled = true;
	chatSendButtonText.classList.add('hidden');
	chatSendButtonLoader.classList.remove('hidden');

	loadingInterval = setInterval(() => {
		loadingCounter += 100;

		const timerSpan = document.querySelector('#chat-timer');
		timerSpan.textContent = `(${Number(loadingCounter / 1000).toFixed(1)}s)`;
	}, 100);

	window.electronAPI.sendChatData(message);
	chatInput.value = '';
}

setClickEvent('chat-send', sendMessage);

setClickEvent('chat-clear', () => {
	window.electronAPI.clearChatData();
});

setClickEvent('manage-files', () => {
	const folderPopup = document.getElementById('folder-popup');
	folderPopup.classList.remove('hidden');
});

setClickEvent('manage-close', () => {
	document.getElementById('folder-popup').classList.add('hidden');
});

// Logic for opening access data
setClickEvent('access-open', () => {
	window.electronAPI.openAccessData();
});

document.getElementById('chat-input').addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		sendMessage();
	}
});
