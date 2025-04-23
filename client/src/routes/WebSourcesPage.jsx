import { createSignal, onMount } from 'solid-js';
import MarkdownPreview from '../components/MarkdownPreview';

function WebSourcesPage() {
	const [sources, setSources] = createSignal([]);
	const [selected, setSelected] = createSignal(null);
	const [content, setContent] = createSignal('');
	const [loading, setLoading] = createSignal(false);
	const [filter, setFilter] = createSignal('');

	async function fetchSources() {
		try {
			const res = await fetch('/api/urls');
			if (!res.ok) throw new Error('Failed to fetch sources');
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
		try {
			const res = await fetch(`/api/urls/${encodeURIComponent(source.id)}`);
			if (!res.ok) throw new Error('Failed to fetch content');
			const text = await res.text();
			setContent(text);
		} catch (e) {
			setContent('Error loading content.');
		}
		setLoading(false);
	}

	const filteredSources = () => sources().filter(s => s.url.toLowerCase().includes(filter().toLowerCase()));

	onMount(() => {
		fetchSources();
	});

	return (
		<div class="flex h-full min-h-screen">
			{/* Sidebar for sources */}
			<aside class="w-72 bg-zinc-800 border-r border-zinc-700 overflow-y-auto h-screen">
				<h2 class="text-xl font-bold px-4 py-5 border-b border-zinc-700">Web sources</h2>
				<div class="px-4 py-2 border-b border-zinc-700">
					<input
						type="text"
						class="w-full px-2 py-1 rounded bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 text-sm"
						placeholder="Filter sources..."
						value={filter()}
						onInput={e => setFilter(e.target.value)}
					/>
				</div>
				<ul>
					{filteredSources().map(source => (
						<li
							class={`px-4 py-3 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors ${
								selected() && selected().id === source.id ? 'bg-zinc-700 font-semibold' : ''
							}`}
							onClick={() => selectSource(source)}
						>
							{source.url}
						</li>
					))}
				</ul>
			</aside>
			{/* Content */}
			<main class="flex-1 p-8 overflow-y-auto">
				{selected() ? (
					<>
						<h1 class="text-2xl font-bold mb-4 break-all">{selected().url}</h1>
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
					<p class="text-zinc-400">Select a web source to view its content.</p>
				)}
			</main>
		</div>
	);
}

export default WebSourcesPage;
