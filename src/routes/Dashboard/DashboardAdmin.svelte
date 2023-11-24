<script lang="ts">
	import Archive from '@/components/Icons/Archive.svelte';
	import CreditCard from '@/components/Icons/CreditCard.svelte';
	import Percentage from '@/components/Icons/Percentage.svelte';
	import DashboardLayout from '@/components/Layout/DashboardLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { UserAuthDataStore } from '@/stores/auth';
	import { createQuery } from '@tanstack/svelte-query';
	import { get, writable, type Writable } from 'svelte/store';

	const userAuth = UserAuthDataStore;
</script>

<DashboardLayout pageName="Dashboard">
	<div class="flex w-full justify-between">
		<div class="flex flex-col gap-3 w-full">
			<h1 class="text-5xl font-semibold">
				Welcome {get(userAuth).display_name} 👋
			</h1>
		</div>
	</div>
</DashboardLayout>
