import { createSignal, onMount } from 'solid-js';

function WebSourcesPage() {
	const [sources, setSources] = createSignal([]);
	const [selected, setSelected] = createSignal(null);
	const [content, setContent] = createSignal('');
	const [loading, setLoading] = createSignal(false);

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

	onMount(() => {
		fetchSources();
	});

	return (
		<div class="flex h-full min-h-screen">
			{/* Sidebar for sources */}
			<aside class="w-72 bg-zinc-800 border-r border-zinc-700 overflow-y-auto h-screen">
				<h2 class="text-lg font-bold px-4 py-2 border-b border-zinc-700">Web Sources</h2>
				<ul>
					{sources().map(source => (
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
							<p>Loading...</p>
						) : (
							<pre class="whitespace-pre-wrap bg-zinc-900 p-4 rounded">{content()}</pre>
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
