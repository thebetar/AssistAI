import { createSignal, onMount, createContext } from 'solid-js';
import { A, useLocation } from '@solidjs/router';

import routes from './constants/routes';
import TagIcon from './assets/svg/used/tag.svg';

// Create context for pending check
export const ApplicationContext = createContext();

function App(props) {
	const [pending, setPending] = createSignal(false);
	const [pendingLoading, setPendingLoading] = createSignal(false);
	const [tags, setTags] = createSignal([]);

	const location = useLocation();

	const checkPending = async () => {
		try {
			const res = await fetch('/api/pending');
			if (!res.ok) {
				return;
			}
			const data = await res.json();
			setPending(!!data.pending);

			return !!data.pending;
		} catch (e) {
			return false;
		}
	};

	const fetchTags = async () => {
		try {
			const res = await fetch('/api/tags');

			if (!res.ok) {
				return;
			}

			const data = await res.json();

			const tags = Array.from(new Set(Object.values(data).flatMap(t => t)));

			setTags(tags);

			return tags;
		} catch (e) {
			return [];
		}
	};

	const getApplicationData = async (refresh = false) => {
		if (refresh) {
			const newPending = await checkPending();
			const newTags = await fetchTags();

			return {
				pending: newPending,
				tags: newTags,
			};
		} else {
			return {
				pending: pending(),
				tags: tags(),
			};
		}
	};

	const handleReloadModel = async () => {
		setPendingLoading(true);

		try {
			await fetch('/api/files/reload', { method: 'POST' });
			setPending(false);
		} catch (e) {
			// ignore
		}

		setPendingLoading(false);
	};

	onMount(() => {
		getApplicationData(true);
	});

	const renderNavItem = item => (
		<li>
			<A
				class="flex items-center gap-x-2 text-white hover:opacity-80 transition-opacity px-6 py-4"
				activeClass="bg-zinc-700"
				href={item.href}
			>
				<img src={item.icon} class="w-4 h-4" /> {item.name}
			</A>
		</li>
	);

	const renderTagItem = item => {
		let href = `/notes/tag/${item}`;

		if (location.pathname === href) {
			href = '/notes';
		}

		return (
			<li>
				<A
					class="flex items-center w-fit gap-x-1 text-white hover:opacity-80 transition-opacity px-2 py-1 bg-indigo-800/30 rounded-md"
					activeClass="bg-indigo-800/90 font-semibold"
					href={href}
				>
					<img src={TagIcon} class="w-4 h-4" />
					{item}
				</A>
			</li>
		);
	};

	return (
		<div class="flex">
			<nav class="bg-zinc-900 h-screen w-80 text-white shadow-md z-50 relative">
				<header class="text-xl font-semibold px-4 pt-6 pb-4">Assist AI</header>

				<ul>{routes.map(renderNavItem)}</ul>

				<header class="text-xl font-semibold px-4 pt-6 pb-2">Tags</header>

				<ul class="flex flex-col gap-2 px-4">{tags().map(renderTagItem)}</ul>

				{/* Pending notification bar */}
				{pending() && (
					<div class="px-4 py-2 rounded border border-yellow-300 bg-yellow-100 text-yellow-900 text-sm absolute bottom-0 left-0 right-0">
						<div class="mb-2">
							<b>Sources have changed.</b><br/>The model needs to reload to include recent changes.
						</div>

						<button
							class="px-4 py-2 rounded bg-yellow-300 text-yellow-900 font-semibold hover:bg-yellow-400 transition disabled:opacity-60 cursor-pointer w-full"
							onClick={handleReloadModel}
							disabled={pendingLoading()}
						>
							{pendingLoading() ? (
								<div class="flex gap-x-1">
									<div class="loader w-3 h-3" />
									Reloading...
								</div>
							) : (
								'Reload Model'
							)}
						</button>
					</div>
				)}
			</nav>

			<div className="h-screen w-screen overflow-y-scroll bg-zinc-800 text-white">
				<ApplicationContext.Provider value={getApplicationData}>{props.children}</ApplicationContext.Provider>
			</div>
		</div>
	);
}

export default App;
