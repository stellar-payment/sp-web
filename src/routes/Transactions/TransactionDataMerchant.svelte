<script lang="ts">
	import { getAllCustomer, getCustomerByID, updateCustomer } from '@/api/accounts/customers';
	import {
		deleteMerchant,
		getAllMerchant,
		getMerchantByID,
		updateMerchant
	} from '@/api/accounts/merchants';
	import { deleteTransaction, getAllTransaction } from '@/api/transactions/transaction';
	import ActionButtonWrapper from '@/components/Action/ActionButtonWrapper.svelte';
	import Button from '@/components/Button/Button.svelte';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import PaginationLimitDropdown from '@/components/Input/PaginationLimitDropdown.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import ConfirmationModal from '@/components/Modal/ConfirmationModal.svelte';
	import FormModal from '@/components/Modal/FormModal.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import type { CustomerData, TransactionData, UserData } from '@/interfaces/data.interface';
	import { createBulkDeleteHandler } from '@/stores/createBulkDeleteHandler';
	import { createEditModal } from '@/stores/createEditModal';
	import { createPaginatedQuery } from '@/stores/createPaginatedQuery';
	import { createUserRoleOption } from '@/stores/options/createUserRoleOption';
	import { useSvelteTable } from '@/stores/useSvelteTable';
	import { formatNumber, translate } from '@/utils/utils';
	import { renderComponent, type ColumnDef } from '@tanstack/svelte-table';
	import dayjs from 'dayjs';
	import { get, writable } from 'svelte/store';
	import type { z } from 'zod';

	let queryObj = writable({});

	const {
		paginationStore,
		query,
		control: { nextPage, previousPage, setPage, changePerPage }
	} = createPaginatedQuery<TransactionData[]>({
		queryObj: queryObj,
		queryFunction: getAllTransaction,
		queryKey: ['transactions']
	});

	const defaultColumns: ColumnDef<TransactionData>[] = [
		{
			header: 'No',
			size: 50,
			cell: ({ row }) =>
				row.index + 1 + (get(paginationStore).page - 1) * get(paginationStore).limit
		},		
		{
			accessorKey: 'account_name',
			header: 'Source',
			cell: (info) => {
				const data = info.getValue() as string;
				return data == "" ? "System" : data  ;
			}
		},
		{
			accessorKey: 'recipient_name',
			header: 'Recipient'
		},
		{
			accessorKey: 'trx_type',
			header: 'Transaction Type',
			cell: (info) => {
				return translate(`trx_type.${info.getValue()}`);
			}
		},
		{
			accessorKey: 'trx_datetime',
			header: 'Datetime',
			cell: (info) => {
				return dayjs(info.getValue() as string).format("YYYY-MM-DD HH:mm:ss")
			}
		},
		{
			accessorKey: 'trx_status',
			header: 'Status',
			cell: (info) => {
				return translate(`trx_status.${info.getValue()}`);
			}
		},
		{
			accessorKey: 'trx_fee',
			header: 'Transaction Fee',
			cell: (info) => {
				return formatNumber(info.getValue() as number)
			}
		},
		{
			accessorKey: 'nominal',
			header: 'Nominal',
			cell: (info) => {
				return formatNumber(info.getValue() as number)
			}
		},
		{
			accessorKey: 'description',
			header: 'Description'
		}
	];

	$: table = useSvelteTable({
		columns: defaultColumns,
		data: $query.data ? $query.data.data : [],
		debugTable: true
	});

	const { roleOption } = createUserRoleOption();
</script>

<AdminPageLayout pageName="Transactions">
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

