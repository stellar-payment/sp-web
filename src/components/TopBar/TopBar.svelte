<script lang="ts">
	import { UserAuthDataStore } from '@/stores/auth';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { capitalize } from 'radash';
	import { onMount } from 'svelte';
	import { type Writable, writable, get } from 'svelte/store';
	import LoadingPulse from '../Loading/LoadingPulse.svelte';
	import Bell from '../Icons/Bell.svelte';
	import BellAlert from '../Icons/BellAlert.svelte';
	import { getInitials } from '@/utils/utils';
	import PopoverProfile from '../Popover/PopoverProfile.svelte';

	let isOpen = false;
	let isNewNotification = false;
	let isOpenProfile = false;
	const client = useQueryClient();

	window.addEventListener("click", (event) => {
		if (
			event.target?.id != "profile-modal" &&
			event.target?.id != "profile-button"
		) {
			isOpen = false
			isOpenProfile = false
		}
	})

	const onClickProfile = () => {
		isOpenProfile = true;
		isOpen = false;
	};

	const onClick = () => {
		isOpen = true;
		isOpenProfile = false;
	};
</script>

<div class="flex gap-5 bg-white rounded-full items-center px-5 py-3 fixed top-4 z-[15]">
	<button
		class="w-[40px] h-[40px] rounded-full border-[1px] flex items-center justify-center bg-gray-200 flex-shrink-0"
		id="profile-button"
		on:click={onClickProfile}
	>
		<p class="text-sm font-bold" id="profile-button">
			{getInitials($UserAuthDataStore.display_name)}
		</p>
	</button>
</div>

<PopoverProfile isOpen={isOpenProfile} />

<!-- <LoadingPulse isLoading={$notificationQuery?.isLoading || $companyQuery?.isLoading} /> -->
