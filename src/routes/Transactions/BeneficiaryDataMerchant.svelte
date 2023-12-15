<script lang="ts">
	import {
		createNewBeneficiary,
		getAllBeneficiary,
		getBeneficiaryPreview
	} from '@/api/transactions/beneficiaries';
	import Button from '@/components/Button/Button.svelte';
	import CreditCard from '@/components/Icons/CreditCard.svelte';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import PaginationLimitDropdown from '@/components/Input/PaginationLimitDropdown.svelte';
	import AdminPageLayout from '@/components/Layout/AdminPageLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import FormModal from '@/components/Modal/FormModal.svelte';
	import Pagination from '@/components/Pagination/Pagination.svelte';
	import Table from '@/components/Table/Table.svelte';
	import { beneficiarySchema } from '@/constant/schema';
	import type { BeneficiaryData } from '@/interfaces/data.interface';
	import { createAddModal } from '@/stores/createAddModal';
	import { createPaginatedQuery } from '@/stores/createPaginatedQuery';
	import { createUserRoleOption } from '@/stores/options/createUserRoleOption';
	import { useSvelteTable } from '@/stores/useSvelteTable';
	import { formatNumber, translate } from '@/utils/utils';
	import { type ColumnDef } from '@tanstack/svelte-table';
	import dayjs from 'dayjs';
	import { get, writable } from 'svelte/store';

	let queryObj = writable({});

	const {
		paginationStore,
		query,
		control: { nextPage, previousPage, setPage, changePerPage }
	} = createPaginatedQuery<BeneficiaryData[]>({
		queryObj: queryObj,
		queryFunction: getAllBeneficiary,
		queryKey: ['beneficiaries']
	});

	const {
		form: { form: addForm, data: addData, setFields },
		modal: { isOpen: isAddModalOpen, closeModal: closeAddModal, openModal: openAddModal },
		mutation: addMutation
	} = createAddModal<any>({
		mutationApi: createNewBeneficiary,
		refetch: $query ? $query.refetch : () => {},
		actionName: 'new transaction',
		formSchema: beneficiarySchema
	});

	const defaultColumns: ColumnDef<BeneficiaryData>[] = [
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
			accessorKey: 'withdrawal_date',
			header: 'Datetime',
			cell: (info) => {
				return dayjs(info.getValue() as string).format('YYYY-MM-DD HH:mm:ss');
			}
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: (info) => {
				return translate(`bnf_status.${info.getValue()}`);
			}
		}
	];

	$: table = useSvelteTable({
		columns: defaultColumns,
		data: $query.data ? $query.data.data : [],
		debugTable: true
	});

	const { roleOption } = createUserRoleOption();

	addData.subscribe(async (val) => {
		if (val && val.pending_settlement.length == 0) {
			const benePreview = await getBeneficiaryPreview();

			setFields('pending_settlement', benePreview ?? 0);
		}
	});
</script>

<AdminPageLayout pageName="Beneficiaries">
	<div class="w-full flex justify-between mt-5">
		<PaginationLimitDropdown {changePerPage} />
		<Button onClick={openAddModal} icon={CreditCard}>Withdraw</Button>
	</div>
	{#if $query.data}
		<Table table={table.table} />
	{/if}
	<div class="w-full flex justify-center mt-10">
		<Pagination {paginationStore} {nextPage} {previousPage} {setPage} />
	</div>
</AdminPageLayout>

<FormModal open={$isAddModalOpen} onCancel={closeAddModal} title="Withdraw Credit" form={addForm}>
	<CustomInput name="pending_settlement" label="Withdrawable Credit" disabled />

	<div class="flex justify-end w-full">
		<Button>Withdraw</Button>
	</div>
</FormModal>

<!-- Loading -->
<LoadingPulse isLoading={$query.isLoading} />
