<script lang="ts">
	import DarkBackground from '@/components/Modal/DarkBackground.svelte';
	import { loadAsset } from '@/utils/dirUtils';

	export let isLoading: boolean;
	export let onClose: () => void = () => {};
</script>

{#if isLoading}
	{#await loadAsset('assets/sp-logo.png') then logoPath}
		<DarkBackground {onClose}>
			<img src={logoPath} alt="SP Logo" class="w-84 h-84 animate-pulse" />
		</DarkBackground>
	{/await}
{/if}
