import { createSignal, onMount } from 'solid-js';
import FormInput from '../components/FormInput';

const SETTINGS_DEFAULTS = {
	chat_model: 'gemma3:1b',
	embedding_model: 'mxbai-embed-large',
	temperature: '0.1',
	github_url: '',
	github_commit_name: '',
	github_commit_email: '',
	github_access_token: '',
};

function SettingsPage() {
	const [loading, setLoading] = createSignal(false);
	const [success, setSuccess] = createSignal(false);

	const [chatModel, setChatModel] = createSignal('');
	const [embeddingModel, setEmbeddingModel] = createSignal('');
	const [temperature, setTemperature] = createSignal('');
	const [githubUrl, setGithubUrl] = createSignal('');
	const [githubAccessToken, setGithubAccessToken] = createSignal('');
	const [syncStatus, setSyncStatus] = createSignal(false);

	async function fetchSettings() {
		const response = await fetch('/api/settings');
		if (!response.ok) {
			return;
		}

		const data = await response.json();

		setChatModel(data?.chat_model || SETTINGS_DEFAULTS.chat_model);
		setEmbeddingModel(data?.embedding_model || SETTINGS_DEFAULTS.embedding_model);
		setTemperature(data?.temperature || SETTINGS_DEFAULTS.temperature);
		setGithubUrl(data?.github_url || SETTINGS_DEFAULTS.github_url);
		setGithubAccessToken(data?.github_access_token || SETTINGS_DEFAULTS.github_access_token);

		if (data?.github_url && data?.github_access_token) {
			setSyncStatus(true);
		}
	}

	async function saveSettings() {
		setLoading(true);

		await fetch('/api/settings', {
			method: 'PUT',
			data: {
				chat_model: chatModel(),
				embedding_model: embeddingModel(),
				temperature: temperature(),
				github_url: githubUrl(),
				github_access_token: githubAccessToken(),
			},
			headers: { 'Content-Type': 'application/json' },
		});
		setLoading(false);
		setSuccess(true);
		await fetchSettings();

		setTimeout(() => {
			setSuccess(false);
		}, 2000);
	}

	onMount(fetchSettings);

	return (
		<div class="max-w-xl mx-auto py-8 px-4">
			<h1 class="text-3xl font-bold mb-4">Settings</h1>
			<div class="text-sm mb-8">
				In this page all kind of settings can be changed for the model. The chat and embedding model represent
				the model that is running within Ollama and is an open input field so it gives more freedom to copy the
				name and paste it. Be aware of typos however. Furthermore a URL can be provided to a github repository
				which will be used to sync the markdown files to.
			</div>
			{success() && <div class="mb-4 text-green-400 font-semibold">Settings saved successfully.</div>}
			<header class="text-lg font-semibold mb-2">Model settings</header>
			<FormInput label="Chat model" value={chatModel} setValue={setChatModel} />
			<FormInput label="Embedding model" value={embeddingModel} setValue={setEmbeddingModel} />
			<FormInput label="Model temperature" value={temperature} setValue={setTemperature} />

			<header class="text-lg font-semibold mt-8 mb-2">Document settings</header>
			<FormInput label="Github repository URL" value={githubUrl} setValue={setGithubUrl} />
			<FormInput label="Github access token" value={githubAccessToken} setValue={setGithubAccessToken} />

			<div class="text-sm mb-4">
				Github sync status:{' '}
				{syncStatus() ? (
					<span class="text-green-500">Connected</span>
				) : (
					<span class="text-red-500">Not connected</span>
				)}
			</div>

			<button
				class="mt-4 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
				onClick={saveSettings}
				disabled={loading()}
			>
				{loading() ? 'Saving...' : 'Save'}
			</button>
		</div>
	);
}

export default SettingsPage;
