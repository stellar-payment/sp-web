<script lang="ts">
	import { formatNumber } from '@/utils/utils';
	import { onMount, type ComponentType, onDestroy } from 'svelte';

	let targetDiv: HTMLDivElement;
	let component;

	export let icon: ComponentType;
	export let title: string;
	export let data: string;

	onMount(() => {
		component = new icon({
			target: targetDiv,
			props: {
				currentColor: '#ffffff'
			}
		});
	});

	onDestroy(() => {
		component = undefined;
	});
</script>

<div
	class="min-w-[80px] w-max h-[80px] flex justify-between px-5 py-4 bg-white shadow-md rounded-lg items-center gap-16"
>
	<div class="flex flex-col">
		<p class="text-sm font-bold text-gray-400">{title}</p>
		<div class="flex gap-2 items-center">
			<p class="text-xl font-semibold">{data}</p>
		</div>
	</div>
	<div
		class="w-10 h-10 bg-brand-primary-gradient-start rounded-lg flex items-center justify-center"
	>
		<div bind:this={targetDiv} />
	</div>
</div>
