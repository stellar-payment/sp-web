<script lang="ts">
	import { deleteTransaction, getAllTransaction } from '@/api/transactions/transaction';
	import ActionButtonWrapper from '@/components/Action/ActionButtonWrapper.svelte';
	import PaginationLimitDropdown from '@/components/Input/PaginationLimitDropdown.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import ConfirmationModal from '@/components/Modal/ConfirmationModal.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import type { TransactionData } from '@/interfaces/data.interface';
	import { createBulkDeleteHandler } from '@/stores/createBulkDeleteHandler';
	import { createPaginatedQuery } from '@/stores/createPaginatedQuery';
	import { createUserRoleOption } from '@/stores/options/createUserRoleOption';
	import { useSvelteTable } from '@/stores/useSvelteTable';
	import { formatNumber, translate } from '@/utils/utils';
	import { renderComponent, type ColumnDef } from '@tanstack/svelte-table';
	import dayjs from 'dayjs';
	import { get, writable } from 'svelte/store';

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

	const {
		control: { deletedID, toggleDeleteID, submitDelete, checkDeleteExist },
		modal: {
			isOpen: isDeleteModalOpen,
			closeModal: closeDeleteModal,
			modalAction: deleteModalAction
		}
	} = createBulkDeleteHandler({
		mutationApi: deleteTransaction,
		refetch: $query ? $query.refetch : () => {},
		actionName: 'Delete Transaction'
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
				return data == '' ? 'System' : data;
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
				return dayjs(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss');
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
				return formatNumber(info.getValue() as number);
			}
		},
		{
			accessorKey: 'nominal',
			header: 'Nominal',
			cell: (info) => {
				return formatNumber(info.getValue() as number);
			}
		},
		{
			accessorKey: 'description',
			header: 'Description'
		},
		{
			accessorKey: 'id',
			header: 'Action',
			cell: (info) =>
				renderComponent(ActionButtonWrapper, {
					button: {
						delete: {
							id: info.getValue() as string,
							actionFn: deleteModalAction
						}
					}
				})
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

<ConfirmationModal
	action="delete this transaction"
	open={$isDeleteModalOpen}
	onContinue={() => {
		submitDelete();
		closeDeleteModal();
	}}
	onCancel={() => closeDeleteModal()}
/>

<!-- Loading -->
<LoadingPulse isLoading={$query.isLoading} />
