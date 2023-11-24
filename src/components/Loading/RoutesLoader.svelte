<script>
	import { loadAsset } from '@/utils/dirUtils';
</script>

<div class="w-full h-full min-h-screen bg-brand-lighter flex items-center justify-center">
	{#await loadAsset('assets/sp-logo.png') then logoPath}
		<img src={logoPath} alt="Stellar-Payment Logo" class="w-40 h-40" />
	{/await}
</div>
