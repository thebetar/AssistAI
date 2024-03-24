// Logic for displaying chat history
function createRow(item) {
	const chatItem = document.createElement('table');
	chatItem.classList.add('bg-gray-100', 'rounded-lg', 'text-gray-900', 'w-full', 'shadow-md');

	const questionRow = document.createElement('tr');

	const questionLabel = document.createElement('td');
	questionLabel.classList.add('font-semibold', 'py-2', 'px-4', 'flex', 'items-start');
	questionLabel.textContent = 'Question:';

	questionRow.appendChild(questionLabel);

	const questionText = document.createElement('td');
	questionText.classList.add('py-2', 'px-4');
	questionText.textContent = item.question;

	questionRow.appendChild(questionText);

	chatItem.appendChild(questionRow);

	const answerRow = document.createElement('tr');

	const answerLabel = document.createElement('td');
	answerLabel.classList.add('font-semibold', 'py-2', 'px-4', 'flex', 'items-start');
	answerLabel.textContent = 'Answer:';

	answerRow.appendChild(answerLabel);

	const answerText = document.createElement('td');
	answerText.classList.add('py-2', 'px-4');
	answerText.innerHTML = item.answer;

	answerRow.appendChild(answerText);

	chatItem.appendChild(answerRow);

	return chatItem;
}

electronAPI.receiveChatData(data => {
	if (loadingInterval) {
		clearInterval(loadingInterval);
		loadingCounter = 0;
	}

	chatSendButton.disabled = false;
	chatSendButtonText.classList.remove('hidden');
	chatSendButtonLoader.classList.add('hidden');

	const chat = document.getElementById('chat-history');

	// Clear old chat history
	chat.innerHTML = '';

	const items = data;
	items.reverse();

	// Display new chat history
	for (const item of items) {
		const chatItem = createRow(item);
		chat.appendChild(chatItem);
	}

	setTimeout(() => {
		const chatContainer = document.querySelector('.custom-scroll');
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}, 100);
});

electronAPI.getChatData();

electronAPI.waitForModel(() => {
	if (loadingInterval) {
		clearInterval(loadingInterval);
		loadingCounter = 0;
	}

	chatSendButton.disabled = false;
	chatSendButtonText.classList.remove('hidden');
	chatSendButtonLoader.classList.add('hidden');

	const popupElement = document.querySelector('#wait-for-model-popup');
	popupElement.classList.toggle('hidden');

	setTimeout(() => {
		popupElement.classList.toggle('hidden');
	}, 2500);
});

// Logic for showing access data
electronAPI.receiveAccessData(data => {
	const access = document.getElementById('access-list');

	if (data.length === 0) {
		const accessItem = document.createElement('div');
		accessItem.classList.add('py-2', 'text-center', 'text-gray-500');
		accessItem.textContent = 'No access data found.';

		access.appendChild(accessItem);
	}

	for (const item of data) {
		const accessItem = document.createElement('div');
		accessItem.classList.add('text-xs', 'text-gray-700');
		accessItem.textContent = `- ${item}`;

		access.appendChild(accessItem);
	}
});

electronAPI.getAccessData();
