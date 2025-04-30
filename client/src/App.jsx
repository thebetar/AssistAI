import { A } from '@solidjs/router';
import routes from './constants/routes';
import { createSignal, onMount, createContext } from 'solid-js';

// Create context for pending check
export const PendingContext = createContext();

function App(props) {
	const [pending, setPending] = createSignal(false);
	const [pendingLoading, setPendingLoading] = createSignal(false);

	const checkPending = async () => {
		try {
			const res = await fetch('/api/pending');
			if (!res.ok) {
				return;
			}
			const data = await res.json();
			setPending(!!data.pending);
		} catch (e) {
			// ignore
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
		checkPending();
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

	return (
		<PendingContext.Provider value={checkPending}>
			<div class="flex">
				<nav class="bg-zinc-900 h-screen w-80 text-white shadow-md z-50">
					<header class="text-xl font-semibold px-4 py-6">Assist AI</header>

					<ul>{routes.map(renderNavItem)}</ul>
				</nav>

				<div className="h-screen w-screen overflow-y-scroll bg-zinc-800 text-white">
					{/* Pending notification bar */}
					{pending() && (
						<div class="p-4 rounded border border-yellow-300 bg-yellow-100 text-yellow-900 flex items-center justify-between">
							<div>
								<b>Sources have changed.</b> The model needs to reload to include recent changes.
								<br />
								<span class="text-xs">Reloading may take a while.</span>
							</div>

							<button
								class="ml-4 px-4 py-2 rounded bg-yellow-300 text-yellow-900 font-semibold hover:bg-yellow-400 transition disabled:opacity-60 cursor-pointer"
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

					<PendingContext.Provider value={checkPending}>{props.children}</PendingContext.Provider>
				</div>
			</div>
		</PendingContext.Provider>
	);
}

export default App;
