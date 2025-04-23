import { marked } from 'marked';
import './MarkdownPreview.css';

function NotePreview(props) {
	return (
		<div class="flex-1 p-4 overflow-y-auto">
			{props.loading() ? (
				<div class="flex items-center gap-x-2">
					<div class="loader" />
					<span class="text-lg font-semibold">Loading...</span>
				</div>
			) : (
				<div class="max-w-full">
					<div class="markdown-preview" innerHTML={marked.parse(props.content)} />
				</div>
			)}
		</div>
	);
}

export default NotePreview;
