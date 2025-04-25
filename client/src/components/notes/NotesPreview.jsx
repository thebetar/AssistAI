import { createSignal } from 'solid-js';

import MarkdownPreview from '../MarkdownPreview';
import MarkdownEditor from '../MarkdownEditor';

import TagSvg from '../../assets/svg/used/tag.svg';
import PencilSvg from '../../assets/svg/used/pencil.svg';
import TrashSvg from '../../assets/svg/used/trash.svg';
import FloppyDiskSvg from '../../assets/svg/used/floppy-disk.svg';
import XMarkSvg from '../../assets/svg/used/xmark.svg';

function NotesPreview({ addMode, setAddMode, fetchNotes, selectedNote, setSelectedNote, checkPending }) {
	const [loading, setLoading] = createSignal(false);
	const [editMode, setEditMode] = createSignal(false);
	const [editContent, setEditContent] = createSignal('');
	const [newNoteName, setNewNoteName] = createSignal('');
	const [newNoteContent, setNewNoteContent] = createSignal('');
	const [tagInput, setTagInput] = createSignal('');

	async function addTag(note, tag) {
		if (!tag.trim()) {
			return;
		}

		const newTag = tag.trim();

		const formData = new FormData();
		formData.append('tag', newTag);

		await fetch(`/api/tags/${encodeURIComponent(note.name)}`, { method: 'POST', body: formData });

		note.tags = [...note.tags, newTag];
		setTagInput('');

		setLoading(true);
		await fetchNotes(note);
		setLoading(false);
	}

	async function removeTag(note, tag) {
		const formData = new FormData();
		formData.append('tag', tag);

		await fetch(`/api/tags/${encodeURIComponent(note.name)}`, { method: 'DELETE', body: formData });

		note.tags = note.tags.filter(t => t !== tag);
		setTagInput('');

		setLoading(true);
		await fetchNotes(note);
		setLoading(false);
	}

	async function deleteNote() {
		const note = selectedNote();
		setSelectedNote(null);

		if (!window.confirm(`Delete note "${note.name}"?`)) {
			return;
		}

		setLoading(true);

		await fetch(`/api/files/${encodeURIComponent(note.name)}`, { method: 'DELETE' });
		await fetchNotes();

		setLoading(false);

		checkPending();
	}

	function startEdit() {
		setEditContent(selectedNote().content);
		setEditMode(true);
	}

	function cancelEdit() {
		setEditMode(false);
	}

	async function saveEdit() {
		setLoading(true);

		const formData = new FormData();
		formData.append('content', editContent());

		await fetch(`/api/files/${selectedNote().name}`, { method: 'PUT', body: formData });

		setSelectedNote({ ...selectedNote(), content: editContent() });

		setEditMode(false);
		await fetchNotes(selectedNote());
		setLoading(false);

		checkPending();
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

		checkPending();
	}

	function cancelAdd() {
		setAddMode(false);
		setNewNoteName('');
		setNewNoteContent('');
	}

	return (
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
							class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
							onClick={saveAdd}
							disabled={loading()}
						>
							Save
						</button>
						<button
							class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition  cursor-pointer"
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
					<div class="flex items-center justify-between mb-4 relative">
						<h1 class="text-2xl font-bold flex-1">{selectedNote().name}</h1>

						{!editMode() ? (
							<div class="flex gap-x-1">
								<button
									class="p-2 rounded-full hover:bg-indigo-700/50 cursor-pointer"
									title="Edit note"
									onClick={startEdit}
								>
									<img src={PencilSvg} class="w-5 h-5" alt="Edit" />
								</button>

								<button
									class="p-2 rounded-full hover:bg-red-700/50 cursor-pointer"
									title="Delete note"
									onClick={e => {
										e.stopPropagation();
										deleteNote();
									}}
								>
									<img src={TrashSvg} class="w-5 h-5" alt="Delete" />
								</button>
							</div>
						) : (
							<div class="flex gap-x-1">
								<button
									class="p-2 rounded-full hover:bg-green-700/50 cursor-pointer"
									title="Save note"
									onClick={e => {
										e.stopPropagation();
										saveEdit();
									}}
								>
									<img src={FloppyDiskSvg} class="w-5 h-5" alt="Save" />
								</button>

								<button
									class="p-2 rounded-full hover:bg-red-700/50 cursor-pointer"
									title="Cancel"
									onClick={e => {
										e.stopPropagation();
										cancelEdit();
									}}
								>
									<img src={XMarkSvg} class="w-5 h-5" alt="Cancel" />
								</button>
							</div>
						)}
					</div>

					{/* Tag management */}
					{!loading() && (
						<div class="mb-4 flex flex-wrap items-center gap-2">
							{selectedNote().tags.map(tag => (
								<div class="bg-zinc-600 text-white px-2 py-1 rounded flex items-center gap-x-2 hover:bg-zinc-500 transition-colors cursor-default">
									<img src={TagSvg} class="w-3 h-3" alt="Tag" />
									<span class="text-base">{tag}</span>
									<button
										class="p-1 rounded-full hover:bg-red-700/50 cursor-pointer"
										title="Delete tag"
										onClick={e => {
											e.stopPropagation();
											removeTag(selectedNote(), tag);
										}}
									>
										<img src={TrashSvg} class="w-3 h-3" />
									</button>
								</div>
							))}
							<form
								onSubmit={e => {
									e.preventDefault();
									addTag(selectedNote(), tagInput());
								}}
							>
								<input
									class="px-2 py-1 rounded focus:bg-zinc-700 focus:outline-none text-base w-fit"
									placeholder="Add tag"
									value={tagInput()}
									onInput={e => setTagInput(e.target.value)}
								/>
							</form>
						</div>
					)}

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
						<MarkdownPreview content={selectedNote().content} />
					)}
				</>
			) : !addMode() ? (
				<p class="text-zinc-400">Select a note to view its content.</p>
			) : null}
		</main>
	);
}

export default NotesPreview;
