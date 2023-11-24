<script lang="ts">
	import { loadAsset } from '@/utils/dirUtils';

	export let title: string;
	export let subtitle: string;
</script>

<div
	class="bg-brand-white px-8 py-14 rounded-lg flex flex-col items-center justify-center gap-3 w-full max-w-screen-md font-roboto"
>
	{#await loadAsset('assets/sp-logo.png') then logoPath}
		<img src={logoPath} class="w-64 h-64" alt="Logo" />
	{/await}
	<div class="flex flex-col gap-2 items-center">
		<h1 class="text-5xl font-bold">
			{title}
		</h1>
		<h2 class="">
			{subtitle}
		</h2>
	</div>
	<slot />
</div>
