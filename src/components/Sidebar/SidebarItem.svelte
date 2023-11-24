<script lang="ts">
	import type { SidebarItemType } from '@/interfaces/nav.interfaces';
	import { UserAuthDataStore } from '@/stores/auth';
	import { checkRoleAccess } from '@/utils/utils';
	import { onMount, type ComponentType } from 'svelte';
	import { location } from 'svelte-spa-router';
	import { link } from 'svelte-spa-router';
	import ChevronDown from '../Icons/ChevronDown.svelte';
	import SidebarItem from '../Sidebar/SidebarItem.svelte';

	let selectedSubMenuKey = '';
	let divTarget: HTMLDivElement;
	let component;

	export let key: string;
	export let route: string;
	export let icon: ComponentType;
	export let subMenu: SidebarItemType[];
	export let selectedMenuKey: string;
	export let roleAccess: number[];
	export let label: string;
	export let setMenuKey: (key: string) => void;
	export let isClickable: boolean;

	const setSubMenuKey = (key: string) => {
		if (selectedSubMenuKey == key) {
			selectedSubMenuKey = '';
		} else {
			selectedSubMenuKey = key;
		}
	};

	$: ({ role_id } = $UserAuthDataStore);

	onMount(() => {
		component = new icon({
			target: divTarget,
			props: {
				currentColor: '#ffffff'
			}
		});
	});
</script>

{#if checkRoleAccess(role_id, roleAccess)}
	<div class="w-full flex flex-col">
		<div class="w-full flex justify-between">
			{#if isClickable}
				<a href={route} class="flex gap-5" use:link>
					<div bind:this={divTarget} />
					<p
						class={`text-white ${
							$location.includes(route) && isClickable == true ? 'font-bold' : ''
						}`}
					>
						{label}
					</p>
				</a>
			{:else}
				<div class="flex gap-5">
					<div bind:this={divTarget} />
					<p class={`text-white`}>
						{label}
					</p>
				</div>
			{/if}
			{#if subMenu.length != 0}
				<button
					on:click={() => {
						setMenuKey(key);
					}}
					class={`${selectedMenuKey == key ? 'rotate-180' : ''} transition-all`}
				>
					<ChevronDown />
				</button>
			{/if}
		</div>
		{#if selectedMenuKey == key}
			<div class="w-full flex flex-col gap-3 mt-2 ml-2">
				{#each subMenu as item}
					{#if item.roleAccess.includes(role_id)}
						<SidebarItem
							setMenuKey={setSubMenuKey}
							selectedMenuKey={selectedSubMenuKey}
							{...item}
						/>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}
