import { createSignal, onMount, useContext } from 'solid-js';
import MarkdownPreview from '../components/MarkdownPreview';
import { PendingContext } from '../App';

// Import SVGs used in NotesPage
import PlusSvg from '../assets/svg/used/plus.svg';
import TrashSvg from '../assets/svg/used/trash.svg';
import PencilSvg from '../assets/svg/used/pencil.svg';

function WebSourcesPage() {
	const [sources, setSources] = createSignal([]);
	const [selected, setSelected] = createSignal(null);
	const [content, setContent] = createSignal('');
	const [loading, setLoading] = createSignal(false);
	const [filter, setFilter] = createSignal('');
	const [addMode, setAddMode] = createSignal(false);
	const [editMode, setEditMode] = createSignal(false);
	const [newUrl, setNewUrl] = createSignal('');
	const [editContent, setEditContent] = createSignal('');
	const [editLoading, setEditLoading] = createSignal(false);

	const checkPending = useContext(PendingContext);

	async function fetchSources() {
		try {
			const res = await fetch('/api/urls');

			if (!res.ok) {
				throw new Error('Failed to fetch sources');
			}

			const data = await res.json();
			setSources(data.urls || []);

			if (data.urls && data.urls.length > 0 && !selected()) {
				selectSource(data.urls[0]);
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function selectSource(source) {
		setSelected(source);
		setLoading(true);
		setContent('');
		setEditMode(false);

		const res = await fetch(`/api/urls/${encodeURIComponent(source.id)}`);

		if (!res.ok) {
			setLoading(false);
			return;
		}

		const text = await res.text();
		setContent(text);
		setLoading(false);
	}

	async function handleAddSource() {
		if (!newUrl().trim()) {
			return;
		}

		setLoading(true);

		const res = await fetch('/api/urls', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: newUrl().trim() }),
		});

		if (!res.ok) {
			setLoading(false);
			return;
		}

		setAddMode(false);
		setNewUrl('');

		const data = await res.json();

		setSources(data.urls);
		setSelected(data.url_id);

		checkPending();
		setLoading(false);
	}

	async function handleDeleteSource(source) {
		if (!window.confirm(`Delete web source "${source.url}"?`)) {
			return;
		}

		setLoading(true);

		const res = await fetch(`/api/urls/${encodeURIComponent(source.id)}`, { method: 'DELETE' });

		if (!res.ok) {
			setLoading(false);
			return;
		}

		const data = await res.json();

		setSelected(null);
		setContent('');
		setSources(data.urls);

		checkPending();
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
		setEditLoading(true);

		const formData = new FormData();
		formData.append('content', editContent());

		await fetch(`/api/urls/${encodeURIComponent(selected().id)}`, {
			method: 'PUT',
			body: formData,
		});

		setEditMode(false);
		await selectSource(selected());

		checkPending();
		setEditLoading(false);
	}

	const filteredSources = () => sources().filter(s => s.url.toLowerCase().includes(filter().toLowerCase()));

	onMount(() => {
		fetchSources();
	});

	return (
		<div class="flex h-full min-h-screen">
			{/* Sidebar for sources */}
			<aside class="w-72 bg-zinc-800 border-r border-zinc-700 overflow-y-auto h-screen">
				<div class="flex items-center justify-between px-4 py-5 border-b border-zinc-700">
					<h2 class="text-xl font-bold">Web sources</h2>
					<button
						class="p-1 rounded-full hover:bg-zinc-700 transition cursor-pointer"
						title="Add web source"
						onClick={() => setAddMode(true)}
					>
						<img src={PlusSvg} class="w-6 h-6" alt="Add" />
					</button>
				</div>
				<div class="px-4 py-2 border-b border-zinc-700">
					<input
						type="text"
						class="w-full px-2 py-1 rounded bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 text-sm"
						placeholder="Filter sources..."
						value={filter()}
						onInput={e => setFilter(e.target.value)}
					/>
				</div>

				{addMode() && (
					<div class="p-4 border-t border-zinc-700 bg-zinc-900">
						<input
							class="w-full mb-2 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-white"
							placeholder="Enter URL (https://...)"
							value={newUrl()}
							onInput={e => setNewUrl(e.target.value)}
						/>
						<div class="flex gap-2">
							<button
								class="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
								onClick={handleAddSource}
								disabled={loading()}
							>
								Add
							</button>
							<button
								class="px-3 py-1 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
								onClick={() => setAddMode(false)}
								disabled={loading()}
							>
								Cancel
							</button>
						</div>
					</div>
				)}

				<ul>
					{filteredSources().map(source => (
						<li
							class={`flex items-center justify-between px-4 py-3 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors ${
								selected() && selected().id === source.id ? 'bg-zinc-700 font-semibold' : ''
							}`}
							onClick={() => selectSource(source)}
						>
							<span class="truncate">{source.url}</span>
							<button
								class="p-2 rounded-full hover:bg-red-700/50 cursor-pointer"
								title="Delete source"
								onClick={e => {
									e.stopPropagation();
									handleDeleteSource(source);
								}}
							>
								<img src={TrashSvg} class="w-4 h-4" alt="Delete" />
							</button>
						</li>
					))}
				</ul>
			</aside>
			{/* Content */}
			<main class="flex-1 p-8 overflow-y-auto">
				{selected() ? (
					<>
						<div class="flex items-center mb-4">
							<h1 class="text-2xl font-bold flex-1 break-all">{selected().url}</h1>
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
							<MarkdownPreview content={content()} />
						)}
					</>
				) : (
					<p class="text-zinc-400">Select a web source to view its content.</p>
				)}
			</main>
		</div>
	);
}

export default WebSourcesPage;
