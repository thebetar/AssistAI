import { A } from '@solidjs/router';
import routes from './constants/routes';

function App(props) {
	const renderNavItem = item => {
		return (
			<li>
				<A
					class="flex items-center gap-x-2 text-white hover:opacity-80 transition-opacity px-4 py-2"
					activeClass="bg-zinc-700"
					href={item.href}
				>
					<img src={item.icon} class="w-4 h-4" /> {item.name}
				</A>
			</li>
		);
	};

	return (
		<div class="flex">
			<nav class="bg-zinc-900 h-screen w-80 text-white py-4 shadow-md z-50">
				<ul>{routes.map(renderNavItem)}</ul>
			</nav>

			<div className="h-screen w-screen overflow-y-scroll bg-zinc-800 text-white">{props.children}</div>
		</div>
	);
}

export default App;
