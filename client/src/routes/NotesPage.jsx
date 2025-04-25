import { createSignal, onMount, useContext } from 'solid-js';

import { PendingContext } from '../App';
import NotesList from '../components/notes/NotesList';
import NotesPreview from '../components/notes/NotesPreview';

function NotesPage() {
	const [notes, setNotes] = createSignal([]);
	const [selectedNote, setSelectedNote] = createSignal(null);
	const [addMode, setAddMode] = createSignal(false);

	const checkPending = useContext(PendingContext);

	async function fetchNotes(selected = null) {
		const response = await fetch('/api/files');

		if (!response.ok) {
			return;
		}

		const data = await response.json();
		setNotes(data.files);

		if (data.files.length > 0) {
			const toSelect = selected || data.files[0];
			setSelectedNote(toSelect);
		} else {
			setSelectedNote(null);
		}
	}

	onMount(() => {
		fetchNotes();
	});

	return (
		<div class="flex h-full min-h-screen">
			{/* Sidebar for notes */}
			<NotesList
				notes={notes}
				selectedNote={selectedNote}
				setSelectedNote={setSelectedNote}
				setAddMode={setAddMode}
			/>

			{/* Note content */}
			<NotesPreview
				selectedNote={selectedNote}
				setSelectedNote={setSelectedNote}
				addMode={addMode}
				setAddMode={setAddMode}
				fetchNotes={fetchNotes}
				checkPending={checkPending}
			/>
		</div>
	);
}

export default NotesPage;
