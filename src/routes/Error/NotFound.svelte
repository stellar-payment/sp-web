<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import { loadAsset } from '@/utils/dirUtils';
</script>

<AdminPageLayout pageName="">
	<div class="w-full flex flex-col items-center gap-5 mt-16">
		{#await loadAsset('assets/404.png') then logoPath}
			<img src={logoPath} class="w-80 h-80" alt="not found" />
		{/await}
		<div class="flex flex-col items-center w-full max-w-screen-xl gap-5"></div>
		<a href="/#/dashboard/" class="text-brand-btn-main text-2xl underline"> Back to Dashboard</a>
	</div>
</AdminPageLayout>
