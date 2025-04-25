import { createSignal } from 'solid-js';

import PlusSvg from '../../assets/svg/used/plus.svg';
import TrashSvg from '../../assets/svg/used/trash.svg';

function WebSourcesList({ sources, selectedSource, setSelectedSource, fetchSources }) {
	const [loading, setLoading] = createSignal(false);
	const [addMode, setAddMode] = createSignal(false);
	const [filter, setFilter] = createSignal('');
	const [newUrl, setNewUrl] = createSignal('');

	const filteredSources = () => sources().filter(s => s.url.toLowerCase().includes(filter().toLowerCase()));

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

		await fetchSources();
		setSelectedSource(data.url_id);
	}

	return (
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

			{addMode() ? (
				<div class="px-4 py-2 border-t border-zinc-700 bg-zinc-900">
					<input
						class="w-full mb-2 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-white"
						placeholder="Enter URL (https://...)"
						value={newUrl()}
						onInput={e => setNewUrl(e.target.value)}
					/>
					<div class="grid grid-cols-2 gap-x-2">
						<button
							class="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
							onClick={handleAddSource}
							disabled={loading()}
						>
							Add
						</button>
						<button
							class="px-3 py-1 rounded bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition cursor-pointer"
							onClick={() => setAddMode(false)}
							disabled={loading()}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div class="px-4 py-2 border-b border-zinc-700">
					<input
						type="text"
						class="w-full px-2 py-1 rounded bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 text-sm focus:outline-none"
						placeholder="Filter sources..."
						value={filter()}
						onInput={e => setFilter(e.target.value)}
					/>
				</div>
			)}

			<ul>
				{filteredSources().map(source => (
					<li
						class={`flex items-center justify-between px-4 py-3 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors ${
							selectedSource() && selectedSource().id === source.id ? 'bg-zinc-700 font-semibold' : ''
						}`}
						onClick={() => setSelectedSource(source)}
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
	);
}

export default WebSourcesList;
