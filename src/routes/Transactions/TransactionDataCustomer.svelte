<script lang="ts">
	import { getAllCustomer, getCustomerByID, updateCustomer } from '@/api/accounts/customers';
	import {
		deleteMerchant,
		getAllMerchant,
		getMerchantByID,
		updateMerchant
	} from '@/api/accounts/merchants';
	import { getAccountByNo, getMeAccount } from '@/api/payments/accounts';
	import {
		createNewTransactionP2P,
		deleteTransaction,
		getAllTransaction
	} from '@/api/transactions/transaction';
	import ActionButtonWrapper from '@/components/Action/ActionButtonWrapper.svelte';
	import AddButton from '@/components/Button/AddButton.svelte';
	import Button from '@/components/Button/Button.svelte';
	import ComboboxInput from '@/components/Input/ComboboxInput.svelte';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import DropdownInput from '@/components/Input/DropdownInput.svelte';
	import PaginationLimitDropdown from '@/components/Input/PaginationLimitDropdown.svelte';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import ConfirmationModal from '@/components/Modal/ConfirmationModal.svelte';
	import FormModal from '@/components/Modal/FormModal.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import { transactionSchema } from '@/constant/schema';
	import type { CustomerData, TransactionData, UserData } from '@/interfaces/data.interface';
	import { createAccountOptions } from '@/options/createAccountOptions';
	import { UserAccountDataStore, getUserAccount } from '@/stores/account';
	import { createAddModal } from '@/stores/createAddModal';
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

	const {
		options: accountOption,
		query: accountQuery,
		keyword: accountKeyword
	} = createAccountOptions({});

	const {
		form: { form: addForm, data: addData, setFields },
		modal: { isOpen: isAddModalOpen, closeModal: closeAddModal, openModal: openAddModal },
		mutation: addMutation
	} = createAddModal<z.infer<typeof transactionSchema>>({
		mutationApi: createNewTransactionP2P,
		refetch: $query ? $query.refetch : () => {},
		formSchema: transactionSchema,
		actionName: 'new transaction',
		submitTransform: (value: z.infer<typeof transactionSchema>) => {
			return {
					...value,
					account_no: getUserAccount().account_no,
					account_id: getUserAccount().id,
			};
		}
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

	addData.subscribe(async (val) => {
		if (val && val.source_id.length == 0) {
			const accountMeta = await getMeAccount();

			if (val.source_id == '') {
				setFields('source_id', accountMeta.account_no);
			}

			if (val.source_balance == '') {
				setFields('source_balance', accountMeta.balance ?? 0);
			}
		}

		if (val && val.recipient_no.length != 0 && val.recipient_no != val.prev_recipient_no) {
			setFields('prev_recipient_no', val.recipient_no)

			const recipientMeta = await getAccountByNo(val.recipient_no)
			setFields('recipient_id', recipientMeta.id)
		}
	});
</script>

<AdminPageLayout pageName="Transactions">
	<div class="w-full flex justify-between mt-5">
		<PaginationLimitDropdown {changePerPage} />
		<AddButton onClick={openAddModal} />
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
<LoadingPulse isLoading={$query.isLoading || $accountQuery.isLoading} />

<!-- Add Modal -->
<FormModal open={$isAddModalOpen} onCancel={closeAddModal} title="New Transaction" form={addForm}>
	<CustomInput name="source_id" label="Source Account" disabled />
	<CustomInput name="source_balance" label="Source Balance" disabled />
	<CustomInput name="recipient_no" label="Destination Account" />
	<CustomInput name="nominal" label="Nominal" />
	<!-- <PasswordInput name="pin" label="PIN" /> -->

	<div class="flex justify-end w-full">
		<Button>Save</Button>
	</div>
</FormModal>