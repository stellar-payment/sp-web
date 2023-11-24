<script lang="ts">
	import { getAllCustomer, getCustomerByID, updateCustomer } from '@/api/accounts/customers';
	import {
		deleteMerchant,
		getAllMerchant,
		getMerchantByID,
		updateMerchant
	} from '@/api/accounts/merchants';
	import { deleteBeneficiary, getAllBeneficiary } from '@/api/transactions/beneficiaries';
	import { deleteTransaction, getAllTransaction } from '@/api/transactions/transaction';
	import ActionButtonWrapper from '@/components/Action/ActionButtonWrapper.svelte';
	import Button from '@/components/Button/Button.svelte';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import ConfirmationModal from '@/components/Modal/ConfirmationModal.svelte';
	import FormModal from '@/components/Modal/FormModal.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import type { CustomerData, UserData } from '@/interfaces/data.interface';
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
	} = createPaginatedQuery<CustomerData[]>({
		queryObj: queryObj,
		queryFunction: getAllBeneficiary,
		queryKey: ['beneficiaries']
	});

	const {
		control: { deletedID, toggleDeleteID, submitDelete, checkDeleteExist },
		modal: {
			isOpen: isDeleteModalOpen,
			closeModal: closeDeleteModal,
			modalAction: deleteModalAction
		}
	} = createBulkDeleteHandler({
		mutationApi: deleteBeneficiary,
		refetch: $query ? $query.refetch : () => {},
		actionName: 'Delete Beneficiary'
	});

	const defaultColumns: ColumnDef<UserData>[] = [
		{
			header: 'No',
			size: 50,
			cell: ({ row }) =>
				row.index + 1 + (get(paginationStore).page - 1) * get(paginationStore).limit
		},		
		{
			accessorKey: 'merchant_name',
			header: 'Merchant',
		},
		{
			accessorKey: 'amount',
			header: 'Nominal',
			cell: (info) => {
				return formatNumber(info.getValue() as number)
			}
		},
		{
			accessorKey: 'withdrawal_date',
			header: 'Datetime',
			cell: (info) => {
				return dayjs(info.getValue() as string).format("YYYY-MM-DD HH:mm:ss")
			}
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: (info) => {
				return translate(`bnf_status.${info.getValue()}`);
			}
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
						},
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

<AdminPageLayout pageName="Beneficiaries">
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
