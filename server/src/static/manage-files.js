import { createSignal, onMount } from 'https://esm.sh/solid-js@1.8.1';
import html from 'https://esm.sh/solid-js@1.8.1/html';

export function ManageFiles() {
    const [files, setFiles] = createSignal([]);
    const [filteredFiles, setFilteredFiles] = createSignal([]);
    const [filter, setFilter] = createSignal('');
    const [showAllFiles, setShowAllFiles] = createSignal(false);

    const fetchFiles = async () => {
        const res = await fetch('/manage/files');
        const data = await res.json();

        const files = data.files || [];

        setFiles(files);
        setFilteredFiles(files.filter(file => isFilter(file)));
    };

    onMount(() => {
        fetchFiles();
    });

    const isFilter = (file) => file.toLowerCase().includes(filter().trim().toLowerCase())

    const handleUpload = async e => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const res = await fetch('/manage/upload', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();

        const files = data.files || [];

        setFiles(files);
        setFilteredFiles(files.filter(file => isFilter(file)));

        setPending(true);

        form.reset();
    };

    const handleDelete = async (e, filename) => {
        e.preventDefault();

        const res = await fetch(`/manage/delete/${encodeURIComponent(filename)}`, {
            method: 'DELETE',
        });
        const data = await res.json();

        const files = data.files || [];

        setFiles(files);
        setFilteredFiles(files.filter(file => isFilter(file)));

        setPending(true);
    };

    const renderFileItem = (file) => {
        return html`
            <li class="manage-list-item">
                <span class="manage-filename">${file}</span>

                <span class="manage-actions">
                    <a
                        href=${`/manage/view/${encodeURIComponent(file)}`}
                        target="_blank"
                        class="manage-action-btn"
                        style="background: #6c757d; margin-bottom: 8px"
                    >
                        <svg
                            width="14px"
                            height="14px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style="vertical-align: middle; margin-right: 4px;"
                        >
                            <path
                                d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        View
                    </a>
                    <a
                        href=${`/manage/download/${encodeURIComponent(file)}`}
                        target="_blank"
                        class="manage-action-btn manage-download-btn"
                        style="margin-bottom: 8px"
                    >
                        <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 16V4M12 16L8 12M12 16L16 12"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <rect
                                x="4"
                                y="18"
                                width="16"
                                height="2"
                                rx="1"
                                fill="currentColor"
                                stroke="none"
                            />
                        </svg>
                        Download
                    </a>
                    <form
                        style="width: 100%; margin: 0; display: inline"
                        onSubmit=${e => handleDelete(e, file)}
                    >
                        <button
                            type="submit"
                            class="manage-action-btn manage-delete-btn"
                        >
                            <svg
                                width="14px"
                                height="14px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style="vertical-align: middle; margin-right: 4px;"
                            >
                                <path
                                    d="M3 6H5H21"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M10 11V17M14 11V17"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            Delete
                        </button>
                    </form>
                </span>
            </li>
        `
    };

    return html`
        <h2>Files</h2>

        <form
            action="/manage/upload"
            method="post"
            enctype="multipart/form-data"
            class="upload-form"
            onSubmit=${handleUpload}
        >
            <input type="file" name="files" multiple required class="upload-input" />
            <button type="submit" class="btn upload-btn">
                <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 4V16M12 4L8 8M12 4L16 8"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <rect x="4" y="20" width="16" height="2" rx="1" fill="currentColor" stroke="none" />
                </svg>

                Upload
            </button>
        </form>

        <div style="display: flex;">
            <input
                type="text"
                id="file-filter"
                placeholder="Filter files..."
                class="form-input"
                style="flex: 1;"
                autocomplete="off"
                value=${() => filter()}
                onInput=${e => setFilter(e.target.value)}
            />
        </div>

        <ul class="manage-list">
            ${() => filteredFiles().length > 0
            ? html`
                    ${() => showAllFiles()
                    ? filteredFiles().map(file => renderFileItem(file))
                    : filteredFiles().slice(0, 3).map(file => renderFileItem(file))}
                `
            : html`<li style="color: #888; padding: 8px">No files found.</li>`}
        </ul>

        ${() =>
            filteredFiles().length > 3
                ? html`
                    <div style="color: #888; font-size: 0.95em; margin-bottom: 0.5em;">
                        Only the first 3 files are shown from the search result.
                        <button
                            type="button"
                            class="btn"
                            style="margin-left: 1em; padding: 2px 10px; font-size: 0.95em;"
                            onClick=${() => setShowAllFiles(v => !v)}
                        >
                            ${showAllFiles() ? 'Show less' : 'Show all'}
                        </button>
                    </div>
                `
                : null}
    </div >
    `
}