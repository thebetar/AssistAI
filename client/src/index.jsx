/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { Router, Route } from '@solidjs/router';
import App from './App';
import AssistPage from './routes/AssistPage';
import NotesPage from './routes/NotesPage';
import WebSourcesPage from './routes/WebSourcesPage';
import RedirectPage from './routes/RedirectPage';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
	);
}

render(
	() => (
		<Router root={App}>
			<Route path="/assist" component={AssistPage} />
			<Route path="/notes" component={NotesPage} />
			<Route path="/web-sources" component={WebSourcesPage} />
			<Route path="*" component={RedirectPage} />
		</Router>
	),
	root,
);
