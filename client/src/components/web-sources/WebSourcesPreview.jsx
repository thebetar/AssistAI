import { createSignal } from 'solid-js';

import MarkdownPreview from '../MarkdownPreview';

import TagSvg from '../../assets/svg/used/tag.svg';
import TrashSvg from '../../assets/svg/used/trash.svg';
import PencilSvg from '../../assets/svg/used/pencil.svg';

function WebSourcesPreview({ selectedSource, fetchSources }) {
	const [loading, setLoading] = createSignal(false);

	const [tagInput, setTagInput] = createSignal('');
	const [editMode, setEditMode] = createSignal(false);
	const [editContent, setEditContent] = createSignal('');
	const [editLoading, setEditLoading] = createSignal(false);

	function startEdit() {
		setEditContent(selectedSource().content);
		setEditMode(true);
	}

	function cancelEdit() {
		setEditMode(false);
	}

	async function saveEdit() {
		setEditLoading(true);

		const formData = new FormData();
		formData.append('content', editContent());

		await fetch(`/api/urls/${encodeURIComponent(selectedSource().id)}`, {
			method: 'PUT',
			body: formData,
		});

		setEditMode(false);
		await fetchSources(selectedSource());

		checkPending();
		setEditLoading(false);
	}

	async function addTag(urlId, tag) {
		if (!tag.trim()) {
			return;
		}

		const formData = new FormData();
		formData.append('tag', tag.trim());

		await fetch(`/api/tags/${encodeURIComponent(urlId)}`, { method: 'POST', body: formData });

		setTagInput('');
		await fetchSources(selectedSource());
	}

	async function removeTag(urlId, tag) {
		const formData = new FormData();
		formData.append('tag', tag);

		await fetch(`/api/tags/${encodeURIComponent(urlId)}`, { method: 'DELETE', body: formData });

		await fetchSources(selectedSource());
	}

	return (
		<main class="flex-1 p-8 overflow-y-auto">
			{selectedSource() ? (
				<>
					<div class="flex items-center mb-4">
						<h1 class="text-2xl font-bold flex-1 break-all">{selectedSource().url}</h1>
						{!editMode() && (
							<button
								class="p-2 rounded-full hover:bg-zinc-700/50 cursor-pointer"
								title="Edit source"
								onClick={startEdit}
							>
								<img src={PencilSvg} class="w-5 h-5" alt="Edit" />
							</button>
						)}
					</div>
					{/* Tag management */}
					<div class="mb-4 flex flex-wrap items-center gap-2">
						{selectedSource()?.tags.map(tag => (
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
								addTag(selectedSource().id, tagInput());
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
					{loading() ? (
						<div class="flex items-center gap-x-2">
							<div class="loader" />
							<span class="text-lg font-semibold">Loading...</span>
						</div>
					) : editMode() ? (
						<div>
							<textarea
								class="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
								rows={12}
								value={editContent()}
								onInput={e => setEditContent(e.target.value)}
							/>
							<div class="flex gap-2">
								<button
									class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
									onClick={saveEdit}
									disabled={editLoading()}
								>
									Save
								</button>
								<button
									class="px-4 py-2 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
									onClick={cancelEdit}
									disabled={editLoading()}
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<MarkdownPreview content={selectedSource().content} />
					)}
				</>
			) : (
				<p class="text-zinc-400">Select a web source to view its content.</p>
			)}
		</main>
	);
}

export default WebSourcesPreview;
