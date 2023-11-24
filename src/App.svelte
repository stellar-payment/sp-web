<script lang="ts">
	import './app.css';
	import '@fontsource/roboto/400.css';
	import '@fontsource/roboto/500.css';
	import '@fontsource/roboto/700.css';
	import '@fontsource/roboto/900.css';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from 'svelte-french-toast';
	import Router from 'svelte-spa-router';
	import { routes } from './constant/routes';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: 3
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<Router {routes} />
</QueryClientProvider>
<Toaster />
