import { createEffect, createSignal } from 'solid-js';

import MarkdownPreview from '../MarkdownPreview';

import TagSvg from '../../assets/svg/used/tag.svg';
import PencilSvg from '../../assets/svg/used/pencil.svg';
import TrashSvg from '../../assets/svg/used/trash.svg';
import XMarkSvg from '../../assets/svg/used/xmark.svg';
import NotesPreviewForm from './NotesPreviewForm';

function NotesPreview({ addMode, setAddMode, fetchNotes, selectedNote, setSelectedNote, notes, tags }) {
	const [loading, setLoading] = createSignal(false);
	const [editMode, setEditMode] = createSignal(false);

	const [tagInput, setTagInput] = createSignal('');
	const [filteredTags, setFilteredTags] = createSignal([]);

	async function addTag(note, tag) {
		setLoading(true);

		if (!tag.trim()) {
			return;
		}

		const newTag = tag.trim();

		await fetch(`/api/tags/${encodeURIComponent(note.name)}`, {
			method: 'POST',
			body: JSON.stringify({
				tag: newTag,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		note.tags = [...note.tags, newTag];
		setTagInput('');

		await fetchNotes(note);

		setLoading(false);
	}

	async function removeTag(note, tag) {
		await fetch(`/api/tags/${encodeURIComponent(note.name)}`, {
			method: 'DELETE',
			body: JSON.stringify({
				tag: tag,
			}),
			headers: { 'Content-Type': 'application/json' },
		});

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
	}

	createEffect(() => {
		if (!tagInput()) {
			return;
		}

		const filtered = tags().filter(tag => tag.toLowerCase().includes(tagInput().toLowerCase()));
		setFilteredTags(filtered);
	});

	return (
		<main class="flex-1 p-8 overflow-y-auto">
			{addMode() ? (
				<NotesPreviewForm fetchNotes={fetchNotes} notes={notes()} close={() => setAddMode(false)} />
			) : editMode() ? (
				<NotesPreviewForm
					fetchNotes={fetchNotes}
					notes={notes()}
					close={() => setEditMode(false)}
					update
					note={selectedNote()}
				/>
			) : selectedNote() ? (
				<>
					<div class="flex items-center justify-between mb-4 relative">
						<h1 class="text-2xl font-bold flex-1">{selectedNote().name}</h1>

						<div class="flex gap-x-1">
							<button
								class="p-2 rounded-full hover:bg-indigo-700/50 cursor-pointer"
								title="Edit note"
								onClick={() => setEditMode(true)}
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
					</div>
					{/* Tag management */}
					{!loading() && (
						<div class="mb-4 flex flex-wrap items-center gap-2">
							{selectedNote().tags.map(tag => (
								<div class="bg-zinc-600 text-white px-2 py-1 rounded flex items-center gap-x-1 hover:bg-zinc-500 transition-colors cursor-default">
									<img src={TagSvg} class="w-[14px] h-[14px]" alt="Tag" />
									<span class="text-base">{tag}</span>
									<button
										class="p-1 rounded-full hover:bg-red-700/50 cursor-pointer"
										title="Delete tag"
										onClick={e => {
											e.stopPropagation();
											removeTag(selectedNote(), tag);
										}}
									>
										<img src={XMarkSvg} class="w-3 h-3" />
									</button>
								</div>
							))}

							<form
								onSubmit={e => {
									e.preventDefault();
									addTag(selectedNote(), tagInput());
								}}
								class="relative"
							>
								<input
									class={`px-2 py-1 focus:bg-zinc-700 focus:outline-none text-base w-[200px] ${
										tagInput().length > 0 ? 'rounded-t-md' : 'rounded-md'
									}`}
									placeholder="Add tag"
									value={tagInput()}
									onInput={e => setTagInput(e.target.value)}
								/>
								{tagInput().length > 0 && filteredTags().length > 0 && (
									<ul class="absolute bg-zinc-800 border border-zinc-700 rounded-b-md max-h-40 overflow-y-auto w-full">
										{filteredTags()
											.slice(0, 5)
											.map(tag => (
												<li
													class="px-2 py-1 hover:bg-zinc-700 cursor-pointer"
													onClick={() => {
														addTag(selectedNote(), tag);
													}}
												>
													{tag}
												</li>
											))}
									</ul>
								)}
							</form>
						</div>
					)}

					<MarkdownPreview content={selectedNote().content} />
				</>
			) : (
				<p class="text-zinc-400">Select a note to view its content.</p>
			)}
		</main>
	);
}

export default NotesPreview;
