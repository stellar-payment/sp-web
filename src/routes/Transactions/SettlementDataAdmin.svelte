<script lang="ts">
	import { getAllSettlement } from '@/api/transactions/settlements';
	import PaginationLimitDropdown from '@/components/Input/PaginationLimitDropdown.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import type { SettlementData } from '@/interfaces/data.interface';
	import { createPaginatedQuery } from '@/stores/createPaginatedQuery';
	import { createUserRoleOption } from '@/stores/options/createUserRoleOption';
	import { useSvelteTable } from '@/stores/useSvelteTable';
	import { formatNumber } from '@/utils/utils';
	import { type ColumnDef } from '@tanstack/svelte-table';
	import dayjs from 'dayjs';
	import { get, writable } from 'svelte/store';

	let queryObj = writable({});

	const {
		paginationStore,
		query,
		control: { nextPage, previousPage, setPage, changePerPage }
	} = createPaginatedQuery<SettlementData[]>({
		queryObj: queryObj,
		queryFunction: getAllSettlement,
		queryKey: ['settlements']
	});

	const defaultColumns: ColumnDef<SettlementData>[] = [
		{
			header: 'No',
			size: 50,
			cell: ({ row }) =>
				row.index + 1 + (get(paginationStore).page - 1) * get(paginationStore).limit
		},
		{
			accessorKey: 'merchant_name',
			header: 'Merchant'
		},
		{
			accessorKey: 'amount',
			header: 'Nominal',
			cell: (info) => {
				return formatNumber(info.getValue() as number);
			}
		},
		{
			accessorKey: 'settlement_date',
			header: 'Datetime',
			cell: (info) => {
				return dayjs(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss');
			}
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: (info) => {
				return info.getValue() == 1 ? 'Settled' : '';
			}
		}
	];

	$: table = useSvelteTable({
		columns: defaultColumns,
		data: $query.data ? $query.data.data : [],
		debugTable: true
	});

	const { roleOption } = createUserRoleOption();
</script>

<AdminPageLayout pageName="Settlements">
	<div class="w-full flex justify-between mt-5">
		<PaginationLimitDropdown {changePerPage} />
	</div>
	{#if $query.data}
		<Table table={table.table} />
	{/if}
	<div class="w-full flex justify-center mt-10">
		<Pagination {paginationStore} {nextPage} {previousPage} {setPage} />
	</div>
</AdminPageLayout>

<!-- Loading -->
<LoadingPulse isLoading={$query.isLoading} />
