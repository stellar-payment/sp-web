<script lang="ts">
	import { UserAuthDataStore } from '@/stores/auth';
	import SidebarItem from './SidebarItem.svelte';
	import { SIDEBAR } from '@/constant/navbar';
	import { NavbarKeyStore, updateNavKey } from '@/stores/navStore';
	import { loadAsset } from '@/utils/dirUtils';

	$: ({ role_id } = $UserAuthDataStore);
</script>

<div
	class="flex flex-col w-64 bg-brand-sidebar min-h-screen max-h-screen items-center justify-between pb-5 shadow-md sticky top-0 flex-shrink-0"
>
	<div class="w-full">
		<div
			class="w-full bg-brand-dark flex flex-col items-center px-10 py-10 border-b-white border-b-[1px]"
		>
			<div class="flex flex-col items-center justify-center scroll w-60 h-60 rounded-full">
				{#await loadAsset('assets/sp-logo.png') then logoPath}
					<img src={logoPath} alt="SP Logo" />
				{/await}
			</div>
		</div>
		<div class="flex flex-col items-start mt-5 gap-5 px-6">
			{#each SIDEBAR as item}
				{#if item.roleAccess.includes(role_id)}
					<SidebarItem setMenuKey={updateNavKey} selectedMenuKey={$NavbarKeyStore} {...item} />
				{/if}
			{/each}
		</div>
	</div>
</div>
