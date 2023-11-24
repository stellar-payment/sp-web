<script lang="ts">
	import { getAllCustomer, getCustomerByID, updateCustomer } from '@/api/accounts/customers';
	import {
		deleteMerchant,
		getAllMerchant,
		getMerchantByID,
		updateMerchant
	} from '@/api/accounts/merchants';
	import { createNewUser, deleteUser, getAllUser, getUserByID, updateUser } from '@/api/auth/user';
	import ActionButtonWrapper from '@/components/Action/ActionButtonWrapper.svelte';
	import AddButton from '@/components/Button/AddButton.svelte';
	import Button from '@/components/Button/Button.svelte';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import DatePicker from '@/components/Input/DatePicker.svelte';
	import DatepickerControlled from '@/components/Input/DatepickerControlled.svelte';
	import PaginationLimitDropdown from '@/components/Input/PaginationLimitDropdown.svelte';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import ConfirmationModal from '@/components/Modal/ConfirmationModal.svelte';
	import FormModal from '@/components/Modal/FormModal.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import {
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
		queryFunction: getAllMerchant,
		queryKey: ['merchants']
	});

	const {
		control: { deletedID, toggleDeleteID, submitDelete, checkDeleteExist },
		modal: {
			isOpen: isDeleteModalOpen,
			closeModal: closeDeleteModal,
			modalAction: deleteModalAction
		}
	} = createBulkDeleteHandler({
		mutationApi: deleteMerchant,
		refetch: $query ? $query.refetch : () => {},
		actionName: 'Delete Merchant'
	});

	const {
		form: { form: editForm, data },
		modal: { isOpen: isEditFormOpen, closeModal: closeEditModal, modalAction: editModalAction },
		mutation: editMutation
	} = createEditModal<z.infer<typeof updateMerchantSchema>>({
		mutationApi: updateMerchant,
		refetch: $query ? $query.refetch : () => {},
		formSchema: updateMerchantSchema,
		actionName: 'Update Merchant',
		queryKey: ['merchant'],
		queryFn: getMerchantByID,
		submitTransform: (value) => {
			return {
				...value
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
			accessorKey: 'name',
			header: 'Name'
		},
		{
			accessorKey: 'phone',
			header: 'Phone'
		},
		{
			accessorKey: 'email',
			header: 'Email'
		},
		{
			accessorKey: 'pic_name',
			header: 'PIC Name'
		},
		{
			accessorKey: 'pic_phone',
			header: 'PIC Phone'
		},
		{
			accessorKey: 'pic_email',
			header: 'PIC Email'
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

<AdminPageLayout pageName="Merchants">
	{#if $query.data}
		<Table table={table.table} />
	{/if}
	<div class="w-full flex justify-center mt-10">
		<Pagination {paginationStore} {nextPage} {previousPage} {setPage} />
	</div>
</AdminPageLayout>

<ConfirmationModal
	action="delete this merchant"
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
<FormModal open={$isEditFormOpen} onCancel={closeEditModal} title="Edit Merchant" form={editForm}>
	<CustomInput name="name" label="Name" />
	<CustomInput name="phone" label="Phone Number" />
	<CustomInput name="email" label="Email" />
	<CustomInput name="address" label="Address" />
	<CustomInput name="pic_name" label="PIC Name" />
	<CustomInput name="pic_phone" label="PIC Phone Number" />
	<CustomInput name="pic_email" label="PIC Email" />
	<div class="flex justify-end w-full">
		<Button>Save</Button>
	</div>
</FormModal>
