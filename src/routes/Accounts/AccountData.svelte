<script lang="ts">
	import {
		deleteMerchant,
		getAllMerchant,
		getMerchantByID,
		updateMerchant
	} from '@/api/accounts/merchants';
	import { deleteAccount, getAccountByID, getAllAccount, updateAccount } from '@/api/payments/accounts';
	import ActionButtonWrapper from '@/components/Action/ActionButtonWrapper.svelte';
	import Button from '@/components/Button/Button.svelte';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import ConfirmationModal from '@/components/Modal/ConfirmationModal.svelte';
	import FormModal from '@/components/Modal/FormModal.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import {
	updateAccountSchema,
		updateCustomerSchema,
		updateMerchantSchema,
		updateUserSchema,
		userSchema
	} from '@/constant/schema';
	import type { CustomerData, UserData } from '@/interfaces/data.interface';
	import { createAddModal } from '@/stores/createAddModal';
	import { createBulkDeleteHandler } from '@/stores/createBulkDeleteHandler';
	import { createEditModal } from '@/stores/createEditModal';
	import { createPaginatedQuery } from '@/stores/createPaginatedQuery';
	import { createUserRoleOption } from '@/stores/options/createUserRoleOption';
	import { useSvelteTable } from '@/stores/useSvelteTable';
	import { translate } from '@/utils/utils';
	import { renderComponent, type ColumnDef } from '@tanstack/svelte-table';
	import { get, writable } from 'svelte/store';
	import type { z } from 'zod';

	let queryObj = writable({});

	const {
		paginationStore,
		query,
		control: { nextPage, previousPage, setPage, changePerPage }
	} = createPaginatedQuery<CustomerData[]>({
		queryObj: queryObj,
		queryFunction: getAllAccount,
		queryKey: ['accounts']
	});

	const {
		control: { deletedID, toggleDeleteID, submitDelete, checkDeleteExist },
		modal: {
			isOpen: isDeleteModalOpen,
			closeModal: closeDeleteModal,
			modalAction: deleteModalAction
		}
	} = createBulkDeleteHandler({
		mutationApi: deleteAccount,
		refetch: $query ? $query.refetch : () => {},
		actionName: 'delete account'
	});

	const {
		form: { form: editForm, data },
		modal: { isOpen: isEditFormOpen, closeModal: closeEditModal, modalAction: editModalAction },
		mutation: editMutation
	} = createEditModal<z.infer<typeof updateAccountSchema>>({
		mutationApi: updateAccount,
		refetch: $query ? $query.refetch : () => {},
		formSchema: updateAccountSchema,
		actionName: 'Update Account',
		queryKey: ['account'],
		queryFn: getAccountByID,
		submitTransform: (value) => {
			return {
				...value,
				"pin": value.pin.toString,
				"owner_id": value.owner_id,
			};
		}
	});

	const defaultColumns: ColumnDef<UserData>[] = [
		{
			header: 'No',
			size: 50,
			cell: ({ row }) =>
				row.index + 1 + (get(paginationStore).page - 1) * get(paginationStore).limit
		},
		{
			accessorKey: 'owner_name',
			header: 'Name'
		},
		{
			accessorKey: 'account_type',
			header: 'Type',
			cell: (info) => {
				return translate(`account_type.${info.getValue()}`);
			}
		},
		{
			accessorKey: 'account_no',
			header: 'Account No'
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
						edit: {
							id: info.getValue() as string,
							actionFn: editModalAction
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

<AdminPageLayout pageName="Accounts">
	{#if $query.data}
		<Table table={table.table} />
	{/if}
	<div class="w-full flex justify-center mt-10">
		<Pagination {paginationStore} {nextPage} {previousPage} {setPage} />
	</div>
</AdminPageLayout>

<ConfirmationModal
	action="delete this account"
	open={$isDeleteModalOpen}
	onContinue={() => {
		submitDelete();
		closeDeleteModal();
	}}
	onCancel={() => closeDeleteModal()}
/>

<!-- Loading -->
<LoadingPulse isLoading={$query.isLoading} />

<!-- Edit Modal -->
<FormModal open={$isEditFormOpen} onCancel={closeEditModal} title="Edit Account" form={editForm}>
	<CustomInput name="account_no" label="Account No" disabled/>
	<PasswordInput name="pin" label="New PIN" />
	<div class="flex justify-end w-full">
		<Button>Save</Button>
	</div>
</FormModal>
