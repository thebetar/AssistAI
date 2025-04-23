import { createSignal, onMount } from 'solid-js';
import MarkdownPreview from '../components/MarkdownPreview';

function NotesPage() {
	const [notes, setNotes] = createSignal([]);
	const [selectedNote, setSelectedNote] = createSignal(null);
	const [content, setContent] = createSignal('');
	const [loading, setLoading] = createSignal(false);

	async function fetchNotes() {
		try {
			const response = await fetch('/api/files');
			if (!response.ok) throw new Error('Network response was not ok');
			const data = await response.json();
			setNotes(data.files);
			// Optionally auto-select the first note
			if (data.files.length > 0 && !selectedNote()) {
				selectNote(data.files[0]);
			}
		} catch (error) {
			console.error('Error fetching notes:', error);
		}
	}

	async function selectNote(note) {
		setSelectedNote(note);
		setLoading(true);
		setContent('');
		try {
			const response = await fetch(`/api/files/${encodeURIComponent(note)}`);
			if (!response.ok) throw new Error('Failed to fetch note content');
			const text = await response.text();
			setContent(text);
		} catch (error) {
			setContent('Error loading note.');
		}
		setLoading(false);
	}

	onMount(() => {
		fetchNotes();
	});

	return (
		<div class="flex h-full min-h-screen">
			{/* Sidebar for notes */}
			<aside class="w-72 bg-zinc-800 border-r border-zinc-700 overflow-y-auto h-screen">
				<h2 class="text-xl font-bold px-4 py-5 border-b border-zinc-700">Notes</h2>

				<ul>
					{notes().map(note => (
						<li
							class={`px-4 py-3 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors ${
								selectedNote() === note ? 'bg-zinc-700 font-semibold' : ''
							}`}
							onClick={() => selectNote(note)}
						>
							{note}
						</li>
					))}
				</ul>
			</aside>

			{/* Note content */}
			<main class="flex-1 p-8 overflow-y-auto">
				{selectedNote() ? (
					<>
						<h1 class="text-2xl font-bold mb-4">{selectedNote()}</h1>

						{loading() ? (
							<div class="flex items-center gap-x-2">
								<div class="loader" />
								<span class="text-lg font-semibold">Loading...</span>
							</div>
						) : (
							<MarkdownPreview content={content()} />
						)}
					</>
				) : (
					<p class="text-zinc-400">Select a note to view its content.</p>
				)}
			</main>
		</div>
	);
}

export default NotesPage;
