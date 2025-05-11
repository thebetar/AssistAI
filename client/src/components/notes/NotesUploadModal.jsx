import { createSignal } from 'solid-js';

export default function NotesUploadModal({ close }) {
	return (
		<div class="bg-zinc-900/20 fixed inset-0 h-screen w-screen flex justify-center items-center z-50">
			<div class="bg-zinc-800 rounded-lg p-6 w-96 shadow-md">
				<h2 class="text-xl font-bold mb-4">Upload Note</h2>
			</div>
		</div>
	);
}
