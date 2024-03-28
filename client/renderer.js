const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Logic for displaying chat history
function createRow(item) {
	const chatItem = document.createElement('table');
	chatItem.classList.add('bg-gray-100', 'rounded-lg', 'text-zinc-900', 'w-[400px]');

	const questionRow = document.createElement('tr');

	const questionLabel = document.createElement('td');
	questionLabel.classList.add('font-semibold', 'py-1', 'px-2', 'flex', 'items-start');
	questionLabel.textContent = 'Question:';

	questionRow.appendChild(questionLabel);

	const questionText = document.createElement('td');
	questionText.classList.add('py-1', 'px-2');
	questionText.textContent = item.question;

	questionRow.appendChild(questionText);

	chatItem.appendChild(questionRow);

	const answerRow = document.createElement('tr');

	const answerLabel = document.createElement('td');
	answerLabel.classList.add('font-semibold', 'py-1', 'px-2', 'flex', 'items-start');
	answerLabel.textContent = 'Answer:';

	answerRow.appendChild(answerLabel);

	const answerText = document.createElement('td');
	answerText.classList.add('py-1', 'px-2');
	answerText.textContent = item.answer;

	answerRow.appendChild(answerText);

	chatItem.appendChild(answerRow);

	return chatItem;
}

window.electronAPI.receiveChatData(data => {
	const chatSendButtonText = chatSendButton.querySelector('#chat-send-text');
	const chatSendButtonLoader = chatSendButton.querySelector('#chat-send-loader');

	chatSendButton.disabled = false;

	chatSendButtonText.classList.remove('hidden');
	// chatSendButtonLoader.classList.add('hidden');

	const chat = document.getElementById('chat-history');

	// Clear old chat history
	chat.innerHTML = '';

	// Display new chat history
	for (const item of data) {
		const chatItem = createRow(item);
		chat.appendChild(chatItem);
	}
});

window.electronAPI.getChatData();

// Logic for sending chat data
const chatSendButton = document.getElementById('chat-send');

chatSendButton.addEventListener('click', () => {
	const message = chatInput.value;

	if (message.length === 0) {
		return;
	}

	const chatSendButtonText = chatSendButton.querySelector('#chat-send-text');
	const chatSendButtonLoader = chatSendButton.querySelector('#chat-send-loader');

	chatSendButton.disabled = true;

	chatSendButtonText.classList.add('hidden');
	chatSendButtonLoader.classList.remove('hidden');

	window.electronAPI.sendChatData(message);
	chatInput.value = '';
});

const chatClearButton = document.getElementById('chat-clear');

chatClearButton.addEventListener('click', () => {
	window.electronAPI.clearChatData();
});

// Logic for showing access data
window.electronAPI.receiveAccessData(data => {
	const access = document.getElementById('access-list');

	if (data.length === 0) {
		const accessItem = document.createElement('div');
		accessItem.classList.add('py-1');
		accessItem.textContent = 'No access data found.';

		access.appendChild(accessItem);
	}

	for (const item of data) {
		const accessItem = document.createElement('div');
		accessItem.classList.add('text-xs');
		accessItem.textContent = `- ${item}`;

		access.appendChild(accessItem);
	}
});

window.electronAPI.getAccessData();
