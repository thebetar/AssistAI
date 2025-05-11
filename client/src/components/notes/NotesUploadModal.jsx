import { createSignal } from 'solid-js';

export default function NotesUploadModal({ fetchNotes, close }) {
	const [files, setFiles] = createSignal([]);
	const [uploading, setUploading] = createSignal(false);
	const [error, setError] = createSignal('');
	const [success, setSuccess] = createSignal(false);

	let fileInputRef;

	const handleFileChange = e => {
		setFiles([...e.target.files]);
		setError('');
		setSuccess(false);
	};

	const handleUpload = async () => {
		if (!files().length) return;
		setUploading(true);
		setError('');
		setSuccess(false);

		const formData = new FormData();
		files().forEach(file => formData.append('files', file));

		try {
			const res = await fetch('/api/files/upload', {
				method: 'POST',
				body: formData,
			});
			if (!res.ok) throw new Error('Upload failed');
			setSuccess(true);
			setFiles([]);
		} catch (e) {
			setError('Upload failed');
		} finally {
			await fetchNotes();
			close();

			setUploading(false);
		}
	};

	const handleFileButtonClick = () => {
		fileInputRef.click();
	};

	return (
		<div class="bg-zinc-900/20 fixed inset-0 h-screen w-screen flex justify-center items-center z-50">
			<div class="bg-zinc-800 rounded-lg p-6 w-full max-w-md shadow-md">
				<h2 class="text-xl font-bold mb-4">Upload Notes</h2>

				{/* Hidden file input */}
				<input
					ref={el => (fileInputRef = el)}
					type="file"
					multiple
					class="hidden"
					onChange={handleFileChange}
					disabled={uploading()}
				/>

				{/* Custom styled button */}
				<button
					type="button"
					class="mb-4 w-full px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600 text-sm font-medium cursor-pointer focus:outline-none focus:ring focus:ring-blue-500"
					onClick={handleFileButtonClick}
					disabled={uploading()}
				>
					{files().length > 0
						? `Change selected file${files().length > 1 ? 's' : ''}`
						: 'Select files to upload'}
				</button>

				<div class="mb-2 text-zinc-400 text-sm">
					{files().length
						? `${files().length} file${files().length > 1 ? 's' : ''} ready to upload`
						: 'No files selected'}
				</div>

				{files().length > 0 && (
					<div class="max-h-96 overflow-y-auto">
						<ul class="list-disc list-inside mb-4">
							{files().map(file => (
								<li key={file.name} class="text-sm text-zinc-400">
									{file.name}
								</li>
							))}
						</ul>
					</div>
				)}

				{error() && <div class="text-red-400 text-sm mb-2">{error()}</div>}
				{success() && <div class="text-green-400 text-sm mb-2">Upload successful!</div>}

				<div class="flex justify-end gap-2 mt-4">
					<button
						class="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer"
						onClick={close}
						disabled={uploading()}
					>
						Close
					</button>
					<button
						class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white cursor-pointer disabled:opacity-50"
						onClick={handleUpload}
						disabled={uploading() || files().length === 0}
					>
						{uploading() ? 'Uploading...' : 'Upload'}
					</button>
				</div>
			</div>
		</div>
	);
}
