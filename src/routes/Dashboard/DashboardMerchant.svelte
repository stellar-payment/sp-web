<script lang="ts">
	import { getAdminDashboard, getMerchantDashboard } from '@/api/dashboard/api';
	import DashboardCard from '@/components/Card/DashboardCard.svelte';
	import DashboardTrxCard from '@/components/Card/DashboardTrxCard.svelte';
	import IDCard from '@/components/Card/IDCard.svelte';
	import Chart from '@/components/Chart/Chart.svelte';
	import Archive from '@/components/Icons/Archive.svelte';
	import CreditCard from '@/components/Icons/CreditCard.svelte';
	import Percentage from '@/components/Icons/Percentage.svelte';
	import DashboardLayout from '@/components/Layout/DashboardLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import Table from '@/components/Table/Table.svelte';
	import { UserAuthDataStore } from '@/stores/auth';
	import { useSvelteTable } from '@/stores/useSvelteTable';
	import { formatNumber } from '@/utils/utils';
	import { createQuery } from '@tanstack/svelte-query';
	import type { ColumnDef } from '@tanstack/svelte-table';
	import dayjs from 'dayjs';
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
		queryKey: ['dashboard-merch'],
		queryFn: () => getMerchantDashboard()
	});

	query.subscribe((value) => {
		if (!value.isLoading && value.data) {
			data.set(
				value.data.trx_traffic.map((value) => {
					return value.value;
				})
			);
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
		<IDCard title="Account No" data={$query.data?.account_id || ''} icon={CreditCard} />
		<IDCard
			title="Account Balance"
			data={formatNumber($query.data?.account_balance || 0) || ''}
			icon={CreditCard}
		/>
	</div>
	<div class="flex flex-wrap gap-2 w-full mt-5">
		<DashboardCard
			title="Total Transaction"
			quantity={$query.data?.trx_count || 0}
			changes={0}
			icon={CreditCard}
		/>
		<DashboardCard
			title="Total Transaction Value"
			quantity={$query.data?.trx_nominal || 0}
			changes={0}
			isCurrency={true}
			icon={CreditCard}
		/>
		<DashboardCard
			title="Settlement Nominal"
			quantity={$query.data?.settlement_nominal || 0}
			isCurrency={true}
			changes={0}
			icon={CreditCard}
		/>
		<DashboardCard
			title="Withdrawn Nominal"
			quantity={$query.data?.beneficiary_nominal || 0}
			changes={0}
			isCurrency={true}
			icon={CreditCard}
		/>
	</div>
	<div class="flex w-full my-10 gap-10">
		<Chart
			chartID="traffic-line"
			chartType="line"
			{data}
			{categories}
			title="Transaction Traffic"
			width="700px"
			height="500px"
		/>
		<div class="flex flex-col w-full gap-5">
			{#if $query.data}
				<div class="flex flex-col gap-2">
					{#each $query.data?.last_trx as trx}
						<DashboardTrxCard
							sender_name={trx.sender_name == '' ? 'System' : trx.sender_name}
							recipient_name={trx.recipient_name}
							nominal={trx.nominal}
							trx_date={trx.trx_date}
							trx_type={trx.trx_type}
							icon={CreditCard}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</DashboardLayout>
