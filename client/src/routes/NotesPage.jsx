import { createSignal, onMount } from 'solid-js';

import PlusSvg from '../assets/svg/used/plus.svg';
import TrashSvg from '../assets/svg/used/trash.svg';
import PencilSvg from '../assets/svg/used/pencil.svg';

import MarkdownPreview from '../components/MarkdownPreview';
import MarkdownEditor from '../components/MarkdownEditor';

function NotesPage() {
	const [notes, setNotes] = createSignal([]);
	const [selectedNote, setSelectedNote] = createSignal(null);
	const [content, setContent] = createSignal('');
	const [loading, setLoading] = createSignal(false);
	const [hoveredNote, setHoveredNote] = createSignal(null);
	const [editMode, setEditMode] = createSignal(false);
	const [editContent, setEditContent] = createSignal('');
	const [addMode, setAddMode] = createSignal(false);
	const [newNoteName, setNewNoteName] = createSignal('');
	const [newNoteContent, setNewNoteContent] = createSignal('');
	const [filter, setFilter] = createSignal('');

	async function fetchNotes(selected = null) {
		try {
			const response = await fetch('/api/files');

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			setNotes(data.files);

			if (data.files.length > 0) {
				const toSelect = selected || data.files[0];
				setSelectedNote(toSelect);
				selectNote(toSelect);
			} else {
				setSelectedNote(null);
				setContent('');
			}
		} catch (error) {
			console.error('Error fetching notes:', error);
		}
	}

	async function selectNote(note) {
		setSelectedNote(note);
		setLoading(true);
		setContent('');
		setEditMode(false);
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

	async function deleteNote(note) {
		if (!window.confirm(`Delete note "${note}"?`)) return;
		setLoading(true);
		await fetch(`/api/files/${encodeURIComponent(note)}`, { method: 'DELETE' });
		await fetchNotes();
		setLoading(false);
	}

	function startEdit() {
		setEditContent(content());
		setEditMode(true);
	}

	function cancelEdit() {
		setEditMode(false);
	}

	async function saveEdit() {
		setLoading(true);

		const formData = new FormData();
		formData.append('content', editContent());

		await fetch(`/api/files/${selectedNote()}`, { method: 'PUT', body: formData });

		setEditMode(false);
		await fetchNotes(selectedNote());
		setLoading(false);
	}

	function startAdd() {
		setAddMode(true);
		setNewNoteName('');
		setNewNoteContent('');
	}

	function cancelAdd() {
		setAddMode(false);
	}

	async function saveAdd() {
		if (!newNoteName().trim()) {
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append('filename', newNoteName());
		formData.append('content', newNoteContent());

		await fetch('/api/files/note', { method: 'POST', body: formData });

		setAddMode(false);
		await fetchNotes(newNoteName());
		setLoading(false);
	}

	const filteredNotes = () => notes().filter(n => n.toLowerCase().includes(filter().toLowerCase()));

	onMount(() => {
		fetchNotes();
	});

	return (
		<div class="flex h-full min-h-screen">
			{/* Sidebar for notes */}
			<aside class="w-80 bg-zinc-800 border-r border-zinc-700 overflow-y-auto h-screen">
				<div class="flex items-center justify-between px-4 py-5 border-b border-zinc-700">
					<h2 class="text-xl font-bold">Notes</h2>
					<button
						class="p-1 rounded-full hover:bg-zinc-700 transition cursor-pointer"
						title="Add note"
						onClick={startAdd}
					>
						<img src={PlusSvg} class="w-6 h-6" alt="Add" />
					</button>
				</div>
				<div class="px-4 py-2 border-b border-zinc-700">
					<input
						type="text"
						class="w-full px-2 py-1 rounded bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 text-sm"
						placeholder="Filter notes..."
						value={filter()}
						onInput={e => setFilter(e.target.value)}
					/>
				</div>
				<ul>
					{filteredNotes().map(note => (
						<li
							class={`group h-14 flex items-center justify-between px-2 py-3 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors ${
								selectedNote() === note ? 'bg-zinc-700 font-semibold' : ''
							}`}
							onClick={() => selectNote(note)}
							onMouseEnter={() => setHoveredNote(note)}
							onMouseLeave={() => setHoveredNote(null)}
						>
							<span class="truncate">{note}</span>
							{hoveredNote() === note && (
								<button
									class="p-2 rounded-full hover:bg-red-700/50 cursor-pointer"
									title="Delete note"
									onClick={e => {
										e.stopPropagation();
										deleteNote(note);
									}}
								>
									<img src={TrashSvg} class="w-4 h-4" alt="Delete" />
								</button>
							)}
						</li>
					))}
				</ul>
			</aside>

			{/* Note content */}
			<main class="flex-1 p-8 overflow-y-auto">
				{addMode() && (
					<div class="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded p-6 mb-8">
						<h2 class="text-xl font-bold mb-4">Add Note</h2>
						<input
							class="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
							placeholder="Note filename (e.g. my-note.md)"
							value={newNoteName()}
							onInput={e => setNewNoteName(e.target.value)}
						/>
						<textarea
							class="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
							rows={10}
							placeholder="Note content (Markdown supported)"
							value={newNoteContent()}
							onInput={e => setNewNoteContent(e.target.value)}
						/>
						<div class="flex gap-2">
							<button
								class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
								onClick={saveAdd}
								disabled={loading()}
							>
								Save
							</button>
							<button
								class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
								onClick={cancelAdd}
								disabled={loading()}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
				{selectedNote() && !addMode() ? (
					<>
						<div class="flex items-center mb-4">
							<h1 class="text-2xl font-bold flex-1">{selectedNote()}</h1>
							{!editMode() && (
								<button
									class="p-2 rounded-full hover:bg-zinc-700/50 cursor-pointer"
									title="Edit note"
									onClick={startEdit}
								>
									<img src={PencilSvg} class="w-5 h-5" alt="Edit" />
								</button>
							)}
						</div>
						{loading() ? (
							<div class="flex items-center gap-x-2">
								<div class="loader" />
								<span class="text-lg font-semibold">Loading...</span>
							</div>
						) : editMode() ? (
							<div class="max-w-full">
								<MarkdownEditor
									class="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
									value={editContent()}
									onInput={e => setEditContent(e)}
								/>

								<div class="flex gap-2">
									<button
										class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
										onClick={saveEdit}
										disabled={loading()}
									>
										Save
									</button>
									<button
										class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition cursor-pointer"
										onClick={cancelEdit}
										disabled={loading()}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<MarkdownPreview content={content()} />
						)}
					</>
				) : !addMode() ? (
					<p class="text-zinc-400">Select a note to view its content.</p>
				) : null}
			</main>
		</div>
	);
}

export default NotesPage;
