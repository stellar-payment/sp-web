<script lang="ts">
	import { createNewUser, deleteUser, getAllUser, getUserByID, updateUser } from '@/api/auth/user';
	import ActionButtonWrapper from '@/components/Action/ActionButtonWrapper.svelte';
	import AddButton from '@/components/Button/AddButton.svelte';
	import Button from '@/components/Button/Button.svelte';
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
	import { updateUserSchema, userSchema } from '@/constant/schema';
	import type { UserData } from '@/interfaces/data.interface';
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
	} = createPaginatedQuery<UserData[]>({
		queryObj: queryObj,
		queryFunction: getAllUser,
		queryKey: ['users']
	});

	const {
		control: { deletedID, toggleDeleteID, submitDelete, checkDeleteExist },
		modal: {
			isOpen: isDeleteModalOpen,
			closeModal: closeDeleteModal,
			modalAction: deleteModalAction
		}
	} = createBulkDeleteHandler({
		mutationApi: deleteUser,
		refetch: $query ? $query.refetch : () => {},
		actionName: 'Delete User'
	});

	const {
		form: { form: editForm, data },
		modal: { isOpen: isEditFormOpen, closeModal: closeEditModal, modalAction: editModalAction },
		mutation: editMutation
	} = createEditModal<z.infer<typeof updateUserSchema>>({
		mutationApi: updateUser,
		refetch: $query ? $query.refetch : () => {},
		formSchema: updateUserSchema,
		actionName: 'Update User',
		queryKey: ['users'],
		queryFn: getUserByID,
		submitTransform: (value) => {
			return {
				...value
			};
		}
	});

	const {
		form: { form: addForm },
		modal: { isOpen: isAddModalOpen, closeModal: closeAddModal, openModal: openAddModal },
		mutation: addMutation
	} = createAddModal<z.infer<typeof userSchema>>({
		mutationApi: createNewUser,
		refetch: $query ? $query.refetch : () => {},
		formSchema: userSchema,
		actionName: 'Add User',
		submitTransform: (value) => {
			return {
				...value,
				role_id: parseInt(value.role_id)
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
			accessorKey: 'username',
			header: 'Name'
		},
		{
			accessorKey: 'role_id',
			header: 'Role',
			cell: (info) => {
				return translate(`role_id.${info.getValue()}`);
			}
		},
		{
			accessorKey: 'user_id',
			header: 'Action',
			size: 50,
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

<AdminPageLayout pageName="Users">
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
	action="delete this user"
	open={$isDeleteModalOpen}
	onContinue={() => {
		submitDelete();
		closeDeleteModal();
	}}
	onCancel={() => closeDeleteModal()}
/>

<!-- Loading -->
<LoadingPulse isLoading={$query.isLoading || $addMutation.isLoading} />

<!-- Add Modal -->
<FormModal open={$isAddModalOpen} onCancel={closeAddModal} title="Add User" form={addForm}>
	<CustomInput label="Username" name="username" />
	<PasswordInput label="Password" name="password" />
	<DropdownInput label="Role" name="role_id" options={$roleOption} />
	<div class="flex justify-end w-full">
		<Button>Save</Button>
	</div>
</FormModal>

<!-- Edit Modal -->
<FormModal open={$isEditFormOpen} onCancel={closeEditModal} title="Edit User" form={editForm}>
	<CustomInput label="Username" name="username" />
	<PasswordInput label="Password" name="password" />
	<div class="flex justify-end w-full">
		<Button>Save</Button>
	</div>
</FormModal>
