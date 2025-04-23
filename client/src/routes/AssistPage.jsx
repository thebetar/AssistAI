import { createSignal, onCleanup, For, onMount } from 'solid-js';
import MarkdownPreview from '../components/MarkdownPreview';

function AssistPage() {
	const [question, setQuestion] = createSignal('');
	const [useRag, setUseRag] = createSignal(true);
	const [noteExtra, setNoteExtra] = createSignal(localStorage.getItem('assistai_save_note_extra') || '');
	const [response, setResponse] = createSignal('');
	const [history, setHistory] = createSignal([]);
	const [loading, setLoading] = createSignal(false);
	const [timer, setTimer] = createSignal(0);
	const [saveSuccess, setSaveSuccess] = createSignal(false);

	let timerInterval = null;

	const startLoading = () => {
		setLoading(true);
		setTimer(0);
		const start = Date.now();
		timerInterval = setInterval(() => {
			setTimer(((Date.now() - start) / 1000).toFixed(1));
		}, 100);
	};

	const stopLoading = () => {
		setLoading(false);
		if (timerInterval) clearInterval(timerInterval);
	};

	onCleanup(() => {
		if (timerInterval) clearInterval(timerInterval);
	});

	onMount(() => {
		fetchHistory();

		const question = localStorage.getItem('assist-message');
		setQuestion(question || '');
	});

	const fetchHistory = async () => {
		const res = await fetch('/api/history');

		if (!res.ok) {
			console.error('Failed to fetch history');
			return;
		}

		const data = await res.json();
		setHistory(data.history || []);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		startLoading();

		const formData = new FormData();
		formData.append('question', question());
		formData.append('use_rag', useRag() ? 'on' : 'off');
		formData.append('clear', 'false');

		const res = await fetch('/api/question', {
			method: 'POST',
			body: formData,
		});
		const data = await res.json();

		setResponse(data.response || '');
		setHistory(data.history || []);
		stopLoading();

		setQuestion('');
		localStorage.setItem('assist-message', '');
	};

	const handleClear = async () => {
		startLoading();

		const formData = new FormData();
		formData.append('question', '');
		formData.append('use_rag', useRag() ? 'on' : 'off');
		formData.append('clear', 'true');

		const res = await fetch('/api/question', {
			method: 'POST',
			body: formData,
		});
		const data = await res.json();

		setResponse('');
		setNoteExtra('');
		setHistory(data.history || []);
		setQuestion('');
		stopLoading();
	};

	const handleNoteExtraInput = e => {
		setNoteExtra(e.target.value);
		localStorage.setItem('assistai_save_note_extra', e.target.value);
	};

	const handleSaveNote = async () => {
		const now = new Date();
		const iso = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
		const filename = `${iso.split('T')[0]}_${iso.split('T')[1]}_assistai_note.md`;

		let note = `# Assist AI Conversation (${now.toLocaleString()})\n\n`;

		const extra = noteExtra();
		if (extra && extra.trim().length > 0) {
			note += `> ${extra.trim().replace(/\n/g, '\n> ')}\n\n`;
		}

		const noteHistory = [...history()].reverse();
		noteHistory.forEach(([q, a], idx) => {
			note += `## Q${idx + 1}\n${q}\n\n## A${idx + 1}\n${a}\n\n`;
		});

		const formData = new FormData();
		formData.append('filename', filename);
		formData.append('content', note);

		const res = await fetch('/api/files/note', {
			method: 'POST',
			body: formData,
		});

		if (!res.ok) {
			return;
		}

		setSaveSuccess(true);
		setTimeout(() => setSaveSuccess(false), 5000);
	};

	const renderHistoryEntry = entry => (
		<div class="mb-6">
			<div class="font-semibold text-blue-400 mb-1">You:</div>
			<MarkdownPreview content={entry[0]} />
			<div class="font-semibold text-green-400 mt-2 mb-1">AI:</div>
			<MarkdownPreview content={entry[1]} />
		</div>
	);

	return (
		<div class="max-w-3xl mx-auto py-8 px-4">
			<h1 class="text-3xl font-bold mb-4">Assist AI</h1>
			<div class="mb-6 p-4 rounded bg-zinc-900 border border-zinc-700">
				<p>
					Assist AI runs locally and answers your questions using the provided documents (in Markdown format)
					and your chat history. With efficient RAG, the model can use a large number of notes as context. You
					can also ask questions without RAG for faster responses.
					<br />
					You can manage your documents in the{' '}
					<a href="/notes" class="font-semibold text-blue-400 cursor-pointer">
						Notes
					</a>{' '}
					and{' '}
					<a href="/web-sources" class="font-semibold text-blue-400 cursor-pointer">
						Web Sources
					</a>{' '}
					tabs on the left.
				</p>
			</div>
			<form class="mb-6" onSubmit={handleSubmit}>
				<div class="flex gap-2 mb-2">
					<input
						type="text"
						name="question"
						placeholder="Enter your question"
						class="flex-1 px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={question()}
						onInput={e => setQuestion(e.target.value)}
						disabled={loading()}
						required
					/>
					<button
						type="submit"
						class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
						disabled={loading()}
					>
						Ask
					</button>
					<button
						type="button"
						class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition cursor-pointer"
						onClick={handleClear}
						disabled={loading()}
					>
						Clear
					</button>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="checkbox"
						id="useRag"
						checked={useRag()}
						onChange={e => setUseRag(e.target.checked)}
						disabled={loading()}
						class="form-checkbox accent-blue-600"
					/>
					<label for="useRag" class="text-sm text-zinc-300">
						Provide answer based on documents
					</label>
				</div>
			</form>

			{loading() && (
				<div class="flex items-center justify-center w-full gap-2 mb-4">
					<div class="loader" />
					<span class="text-blue-400 font-semibold">Loading... {timer()}s</span>
				</div>
			)}

			{response() && !loading() && (
				<div class="mb-8">
					<h2 class="text-xl font-bold mb-2">Response:</h2>
					<MarkdownPreview content={response()} />
				</div>
			)}
			{saveSuccess() && <div class="mb-4 text-green-400 font-semibold">Conversation saved as note!</div>}
			<div class="mb-6">
				<textarea
					class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white mb-2"
					placeholder="Add a custom note to include in the saved note (will be saved for next time)..."
					value={noteExtra()}
					onInput={handleNoteExtraInput}
					rows={2}
				/>
				<button
					type="button"
					class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
					onClick={handleSaveNote}
				>
					Save Conversation as Note
				</button>
			</div>
			{history().length > 0 && (
				<div class="bg-zinc-900 border border-zinc-700 rounded p-4">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-bold">Chat History</h2>
					</div>
					<div class="max-h-96 overflow-y-auto">
						<For each={[...history()].reverse()}>{renderHistoryEntry}</For>
					</div>
				</div>
			)}
		</div>
	);
}

export default AssistPage;
