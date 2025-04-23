import { useNavigate } from '@solidjs/router';

function RedirectPage(props) {
	const navigate = useNavigate();

	if (props.url) {
		navigate(props.url);
	}

	navigate('/assist');

	return (
		<div class="flex items-center justify-center h-screen">
			<h1 class="text-2xl font-bold">Redirecting...</h1>
		</div>
	);
}

export default RedirectPage;
