import { createSignal, onMount, useContext } from 'solid-js';
import { PendingContext } from '../App';

// Import SVGs used in NotesPage
import WebSourcesList from '../components/web-sources/WebSourcesList';
import WebSourcesPreview from '../components/web-sources/WebSourcesPreview';

function WebSourcesPage() {
	const [sources, setSources] = createSignal([]);
	const [selectedSource, setSelectedSource] = createSignal(null);

	const [newUrl, setNewUrl] = createSignal('');

	const checkPending = useContext(PendingContext);

	async function fetchSources(selected) {
		const res = await fetch('/api/urls');

		if (!res.ok) {
			return;
		}

		const data = await res.json();
		setSources(data.urls || []);

		if (data.urls && data.urls.length > 0 && !selectedSource()) {
			const toSelect = selected || data.urls[0];
			setSelectedSource(toSelect);
		} else {
			setSelectedSource(null);
		}
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

		setSelectedSource(null);
		setContent('');
		setSources(data.urls);

		checkPending();
		setLoading(false);
	}

	onMount(() => {
		fetchSources();
	});

	return (
		<div class="flex h-full min-h-screen">
			{/* Sidebar for sources */}
			<WebSourcesList
				sources={sources}
				selectedSource={selectedSource}
				setSelectedSource={setSelectedSource}
				fetchSources={fetchSources}
			/>

			{/* Content */}
			<WebSourcesPreview selectedSource={selectedSource} fetchSources={fetchSources} />
		</div>
	);
}

export default WebSourcesPage;
