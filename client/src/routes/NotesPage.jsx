import { createSignal, onMount, useContext } from 'solid-js';

import { ApplicationContext } from '../App';
import NotesList from '../components/notes/NotesList';
import NotesPreview from '../components/notes/NotesPreview';

function NotesPage() {
	const [notes, setNotes] = createSignal([]);
	const [tags, setTags] = createSignal([]);
	const [selectedNote, setSelectedNote] = createSignal(null);
	const [addMode, setAddMode] = createSignal(false);

	const getApplicationData = useContext(ApplicationContext);

	async function fetchNotes(selected = null) {
		const response = await fetch('/api/files');

		if (!response.ok) {
			return;
		}

		const data = await response.json();

		if (!data || !data.files) {
			return;
		}

		// Remove file extension from names
		const files = data.files;

		setNotes(files);

		getApplicationData(true).then(data => {
			setTags(data.tags);
		});

		if (files && files.length > 0) {
			if (selected) {
				setSelectedNote(selected);
				return;
			}

			if (localStorage.getItem('selectedNote')) {
				const local = files.find(f => f.name === localStorage.getItem('selectedNote'));
				if (local) {
					setSelectedNote(local);
					return;
				}
			}

			setSelectedNote(null);
		} else {
			setSelectedNote(null);
		}
	}

	function handleSetSelectedNote(note) {
		localStorage.setItem('selectedNote', note.name);
		setAddMode(false);
		setSelectedNote(note);
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
				setSelectedNote={handleSetSelectedNote}
				setAddMode={setAddMode}
				fetchNotes={fetchNotes}
			/>

			{/* Note content */}
			<NotesPreview
				selectedNote={selectedNote}
				setSelectedNote={setSelectedNote}
				addMode={addMode}
				setAddMode={setAddMode}
				fetchNotes={fetchNotes}
				getApplicationData={getApplicationData}
				notes={notes}
				tags={tags}
			/>
		</div>
	);
}

export default NotesPage;
