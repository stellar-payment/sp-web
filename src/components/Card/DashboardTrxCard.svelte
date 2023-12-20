<script lang="ts">
	import { formatNumber, translate } from '@/utils/utils';
	import { onMount, type ComponentType, onDestroy } from 'svelte';

	let targetDiv: HTMLDivElement;
	let component;

	export let icon: ComponentType;
	export let sender_name: string;
	export let recipient_name: string;
	export let nominal: number;
	export let trx_date: string;
	export let trx_type: number;

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

	console.log('tt', trx_type);
</script>

<div
	class="w-[450px] h-[120px] flex justify-between px-5 py-4 bg-white shadow-md rounded-lg items-center gap-16"
>
	<div class="flex flex-col gap-1">
		<p class="text-sm font-bold text-gray-400">{sender_name} → {recipient_name}</p>
		<p class="text-xl font-semibold">{formatNumber(nominal)}</p>
		<div class="flex gap-5">
			<p class="text-sm font-semibold text-gray-400">{trx_date}</p>
			<p class="text-sm font-semibold text-gray-400">{translate(`trx_type.${trx_type}`)}</p>
		</div>
	</div>
	<div
		class="w-10 h-10 bg-brand-primary-gradient-start rounded-lg flex items-center justify-center"
	>
		<div bind:this={targetDiv} />
	</div>
</div>
