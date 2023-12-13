<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';

	export let onClick: () => void = () => {};
	export let icon: ComponentType | undefined = null;
	export let type: 'submit' | 'reset' | 'button' = 'submit';

	let divTarget: HTMLDivElement;
	let component;

	if (icon) {
		onMount(() => {
			component = new icon({
				target: divTarget,
				props: {
					currentColor: '#ffffff'
				}
			});
		});
	}
</script>

<button
	class="bg-brand-btn-main text-xl px-5 py-1 flex gap-2 text-white font-bold rounded-md items-center"
	{type}
	on:click={onClick}
>
	<div class="w-full text-base font-roboto"><slot /></div>
	{#if icon}
		<div class="w-5 h-5">
			<div bind:this={divTarget} />
		</div>
	{/if}
</button>
