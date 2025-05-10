import { onMount, onCleanup, createEffect } from 'solid-js';
import EasyMDE from 'easymde';
import hljs from 'highlight.js';

import 'highlight.js/styles/github.css'; // You can choose other styles too
import 'easymde/dist/easymde.min.css';
import './MarkdownEditor.css';

function MarkdownEditor(props) {
	let editorRef;
	let easyMDE;
	let styleTag;

	onMount(() => {
		easyMDE = new EasyMDE({
			element: editorRef,
			initialValue: props.value || '',
			autoDownloadFontAwesome: false,
			spellChecker: false,
			status: false,
			renderingConfig: {
				codeSyntaxHighlighting: true,
			},
			toolbar: [],
		});

		easyMDE.codemirror.on('change', () => {
			const val = easyMDE.value();
			props.onInput?.(val);
		});
	});

	createEffect(() => {
		if (easyMDE && props.value !== undefined && easyMDE.value() !== props.value) {
			easyMDE.value(props.value);
		}
	});

	onCleanup(() => {
		if (easyMDE) {
			easyMDE.toTextArea();
			easyMDE = null;
		}
		if (styleTag) {
			styleTag.remove();
			styleTag = null;
		}
	});

	return <textarea ref={el => (editorRef = el)} placeholder={props.placeholder} class={props.class} />;
}

export default MarkdownEditor;
