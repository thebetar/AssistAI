import { createSignal, onMount, createEffect } from 'solid-js';

function MarkdownEditor(props) {
	const [value, setValue] = createSignal(props.value || '');
	let textareaRef;

	const resize = () => {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = textareaRef.scrollHeight + 'px';
		}
	};

	onMount(resize); // Resize on mount
	createEffect(() => {
		resize(); // Resize on content change
		props.onInput?.(value()); // Emit updated value
	});

	return (
		<textarea
			ref={el => (textareaRef = el)}
			value={value()}
			onInput={e => setValue(e.currentTarget.value)}
			style={{ overflow: 'hidden', resize: 'none' }}
			placeholder={props.placeholder}
			class={props.class}
		/>
	);
}

export default MarkdownEditor;
