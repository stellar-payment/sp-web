<script lang="ts">
	import { getAdminDashboard } from '@/api/dashboard/api';
	import DashboardCard from '@/components/Card/DashboardCard.svelte';
	import Chart from '@/components/Chart/Chart.svelte';
	import Archive from '@/components/Icons/Archive.svelte';
	import CreditCard from '@/components/Icons/CreditCard.svelte';
	import Percentage from '@/components/Icons/Percentage.svelte';
	import DashboardLayout from '@/components/Layout/DashboardLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { UserAuthDataStore } from '@/stores/auth';
	import { createQuery } from '@tanstack/svelte-query';
	import { get, writable, type Writable } from 'svelte/store';

	const categories = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	let data: Writable<number[]> = writable([]);

	const query = createQuery({
		queryKey: ['dashboard-admin'],
		queryFn: () => getAdminDashboard()
	});

	query.subscribe((value) => {
		if (!value.isLoading && value.data) {
			data.set(
				value.data.trx_traffic.map((value) => {
					return value.value;
				})
			);
			// weeklyData.set(
			// 	value.data.data.sales_graph.map((value) => {
			// 		return value.value;
			// 	})
			// );
		}
	});

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
	<div class="flex flex-wrap gap-2 w-full mt-10">
		<DashboardCard
			title="Total Peer Transaction"
			quantity={$query.data?.peer_trx_count || 0}
			changes={0}
			icon={CreditCard}
		/>
		<DashboardCard
			title="Total Merchant Transaction"
			quantity={$query.data?.merchant_trx_count || 0}
			changes={0}
			icon={CreditCard}
		/>
		<DashboardCard
			title="Total Customer"
			quantity={$query.data?.total_customers || 0}
			changes={0}
			icon={CreditCard}
		/>
		<DashboardCard
			title="Total Merchant"
			quantity={$query.data?.total_merchants || 0}
			changes={0}
			icon={CreditCard}
		/>
	</div>
	<div class="flex w-full mt-10 gap-5">
		<Chart
			chartID="traffic-line"
			chartType="line"
			{data}
			{categories}
			title="Transaction Traffic"
			width="1200px"
			height="500px"
		/>
	</div>
</DashboardLayout>
