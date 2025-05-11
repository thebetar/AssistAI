import { createEffect, createSignal } from 'solid-js';

import MarkdownPreview from '../MarkdownPreview';
import MarkdownEditor from '../MarkdownEditor';

import XMarkSvg from '../../assets/svg/used/xmark.svg';
import PlusSvg from '../../assets/svg/used/plus.svg';

function NotesPreviewForm({ note, close, fetchNotes, notes, update = false }) {
	const [noteName, setNoteName] = createSignal(update ? note.name : '');
	const [noteContent, setNoteContent] = createSignal(update ? note.content : '');
	const [loading, setLoading] = createSignal(false);

	const [relatedNoteInput, setRelatedNoteInput] = createSignal('');
	const [relatedNotes, setRelatedNotes] = createSignal([]);
	const [filteredRelatedNotes, setFilteredRelatedNotes] = createSignal([]);
	const [enrichLoading, setEnrichLoading] = createSignal(false);
	const [enrichContent, setEnrichContent] = createSignal('');

	async function save() {
		if (!noteName().trim()) {
			return;
		}

		setLoading(true);

		let res;

		if (!update) {
			res = await fetch('/api/files', {
				method: 'POST',
				body: JSON.stringify({
					filename: noteName(),
					content: noteContent(),
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} else {
			res = await fetch(`/api/files/${note.name}`, {
				method: 'PUT',
				body: JSON.stringify({
					filename: noteName(),
					content: noteContent(),
				}),
				headers: { 'Content-Type': 'application/json' },
			});
		}

		await fetchNotes({
			...note,
			name: noteName(),
			content: noteContent(),
			tags: [],
		});

		setLoading(false);

		close();
	}

	async function enrichNote() {
		setEnrichLoading(true);

		if (!noteContent().trim()) {
			return;
		}

		const res = await fetch('/api/files/enrich', {
			method: 'POST',
			body: JSON.stringify({
				content: noteContent(),
				relatedNotes: relatedNotes().map(note => note.name),
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await res.json();

		setEnrichContent(data.enrichedContent);
		setEnrichLoading(false);
	}

	function acceptEnrich() {
		setNoteContent(enrichContent());
		setEnrichContent('');
	}

	createEffect(() => {
		const selectedNames = new Set(relatedNotes().map(note => note.name));
		const filtered = notes.filter(
			note => note.name.toLowerCase().includes(relatedNoteInput().toLowerCase()) && !selectedNames.has(note.name),
		);
		setFilteredRelatedNotes(filtered);
	});

	return (
		<div>
			<div className="w-full flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold">{!update ? 'Add Note' : 'Edit Note'}</h2>

				<div class="flex gap-2">
					<button
						class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
						onClick={save}
						disabled={loading()}
					>
						Save
					</button>
					<button
						class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition  cursor-pointer"
						onClick={close}
						disabled={loading()}
					>
						Cancel
					</button>
				</div>
			</div>

			<input
				class="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
				placeholder="Note filename (e.g. my-note.md)"
				value={noteName()}
				onInput={e => setNoteName(e.target.value)}
			/>

			<MarkdownEditor
				value={noteContent()}
				onInput={e => setNoteContent(e)}
				placeholder="Write your note here..."
				class="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white min-h-96"
			/>

			<div class="flex gap-2 mt-4">
				<button
					class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
					onClick={save}
					disabled={loading()}
				>
					Save
				</button>
				<button
					class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition  cursor-pointer"
					onClick={close}
					disabled={loading()}
				>
					Cancel
				</button>
			</div>

			<div class="mt-8 flex flex-col gap-2">
				<header class="font-semibold text-xl">Enrich this note using AI</header>

				<p class="text-sm">
					Using selected related notes and the content of this note the AI model will generate a suggestion
					for an updated note which will overwrite the current note.
				</p>

				<div class="flex flex-col gap-2">
					<label class="text-sm font-semibold text-gray-500">Related notes to use for enrichment</label>
					<input
						class="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
						placeholder="Related note"
						value={relatedNoteInput()}
						onInput={e => setRelatedNoteInput(e.target.value)}
					/>

					<div className="flex gap-x-2 h-64">
						<div class="flex flex-col gap-2 flex-1">
							<label class="text-sm font-semibold text-gray-500">Available notes</label>

							<div class="max-h-58 overflow-auto p-1 flex flex-col gap-2">
								{filteredRelatedNotes().map(note => (
									<div
										class="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
										key={note.name}
									>
										<p class="text-sm text-gray-300">{note.name}</p>
										<button
											class="p-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
											onClick={() => {
												setRelatedNotes([...relatedNotes(), note]);
												setRelatedNoteInput('');
											}}
										>
											<img src={PlusSvg} class="w-4 h-4" alt="Add" />
										</button>
									</div>
								))}
							</div>
						</div>
						<div class="flex flex-col gap-2 flex-1">
							<label class="text-sm font-semibold text-gray-500">Selected notes</label>

							<div class="max-h-58 overflow-auto p-1 flex flex-col gap-2">
								{relatedNotes().map(note => (
									<div
										class="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
										key={note.name}
									>
										<p class="text-sm text-gray-300">{note.name}</p>
										<button
											class="p-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
											onClick={() => {
												setRelatedNotes(relatedNotes().filter(n => n.name !== note.name));
											}}
										>
											<img src={XMarkSvg} class="w-4 h-4" alt="Delete" />
										</button>
									</div>
								))}
							</div>
						</div>
					</div>

					<button
						class="mt-2 px-4 py-2 rounded w-fit bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
						onClick={enrichNote}
						disabled={loading() || enrichLoading() || !noteContent()}
					>
						Enhance with AI
					</button>

					{enrichLoading() ? (
						<div class="mt-4">
							<p class="text-gray-500">Enriching note...</p>
						</div>
					) : enrichContent() ? (
						<>
							<MarkdownPreview content={enrichContent()} class="mt-4" />

							<div class="flex gap-2 mt-4">
								<button
									class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
									onClick={acceptEnrich}
								>
									Accept
								</button>
								<button
									class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition  cursor-pointer"
									onClick={() => setEnrichContent('')}
								>
									Cancel
								</button>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default NotesPreviewForm;
