import { createEffect, createSignal } from 'solid-js';
import { useParams } from '@solidjs/router';

import PlusSvg from '../../assets/svg/used/plus.svg';
import UploadSvg from '../../assets/svg/used/upload.svg';
import NotesUploadModal from './NotesUploadModal';

const STARTS_WITH_FILTER = ['#', '-', 'title:', 'uuid:', 'version:', 'created:', 'tags:'];
const MAX_PREVIEW_LENGTH = 80;

function NotesList({ notes = [], selectedNote, setSelectedNote, setAddMode, fetchNotes }) {
	const [filter, setFilter] = createSignal('');
	const [filteredNotes, setFilteredNotes] = createSignal([]);
	const [showUploadModal, setShowUploadModal] = createSignal(false);

	const params = useParams();

	function getPreviewDescription(content) {
		const lines = content.split('\n');

		let preview;

		if (lines.length > 1) {
			preview = lines
				.filter(l => !STARTS_WITH_FILTER.some(prefix => l.trim().startsWith(prefix)) && l.trim().length > 0)
				.slice(0, 2)
				.join(' ');
		} else {
			preview = lines[0];
		}

		if (preview.length > MAX_PREVIEW_LENGTH) {
			preview = preview.slice(0, MAX_PREVIEW_LENGTH) + '...';
		}

		return preview;
	}

	createEffect(() => {
		function runFilter() {
			if (params.tag) {
				const tag = params.tag.toLowerCase();
				setFilteredNotes(
					notes()
						.filter(n => n.tags.some(t => t.toLowerCase() === tag))
						.filter(n =>
							`${n.name.toLowerCase()} ${n.content.toLowerCase()}`.includes(filter().toLowerCase()),
						),
				);
				return;
			}

			setFilteredNotes(
				notes().filter(n =>
					`${n.name.toLowerCase()} ${n.content.toLowerCase()}`.includes(filter().toLowerCase()),
				),
			);
		}

		if (notes().length > 0) {
			runFilter();
		}
	}, [notes, filter, params]);

	return (
		<aside class="w-80 bg-zinc-800 border-r border-zinc-700 overflow-y-auto h-screen">
			<div class="flex items-center justify-between px-4 py-5 border-b border-zinc-700">
				<h2 class="text-xl font-bold">Notes</h2>

				<div className="flex gap-x-2">
					<button
						class="p-1 rounded-full hover:bg-zinc-700 transition cursor-pointer"
						title="Import notes"
						onClick={() => setShowUploadModal(true)}
					>
						<img src={UploadSvg} class="w-5 h-5" alt="Import" />
					</button>

					<button
						class="p-1 rounded-full hover:bg-zinc-700 transition cursor-pointer"
						title="Add note"
						onClick={() => setAddMode(true)}
					>
						<img src={PlusSvg} class="w-6 h-6" alt="Add" />
					</button>
				</div>
			</div>

			<div class="px-4 py-2 border-b border-zinc-700">
				<input
					type="text"
					class="w-full px-2 py-1 rounded bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 text-sm focus:outline-none"
					placeholder="Filter notes..."
					value={filter()}
					onInput={e => setFilter(e.target.value)}
				/>
			</div>

			<ul>
				{filteredNotes().map(note => (
					<li
						class={`relative group h-24 flex items-center justify-between px-2 py-3 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors ${
							selectedNote()?.name === note.name ? 'bg-zinc-700/60 font-semibold' : ''
						}`}
						onClick={() => setSelectedNote(note)}
					>
						<div class="overflow-hidden w-full">
							<div class="truncate">{note.name}</div>

							<div class="italic text-sm text-zinc-400">{getPreviewDescription(note.content)}</div>
						</div>
					</li>
				))}
			</ul>

			{showUploadModal() && <NotesUploadModal fetchNotes={fetchNotes} close={() => setShowUploadModal(false)} />}
		</aside>
	);
}

export default NotesList;
