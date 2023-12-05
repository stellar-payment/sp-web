<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import AuthCard from '@/components/Card/AuthCard.svelte';
	import AuthLayout from '@/components/Layout/AuthLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { accountSchema, clientRegSchema } from '@/constant/schema';
	import { createMutationForm } from '@/stores/createMutationForm';
	import { createNewAccount } from '@/api/payments/accounts';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import { UserAuthDataStore, getAuthUser } from '@/stores/auth';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import { getUserAccount } from '@/stores/account';
	import type { z } from 'zod';
	import AccountData from '../Accounts/AccountData.svelte';
	import type { UserAccountData } from '@/interfaces/auth.interface';

	const {
		form: { form, setFields, data },
		mutation: { mutation }
	} = createMutationForm({
		mutationApi: createNewAccount,
		formSchema: accountSchema,
		actionName: 'account creation',
		callbackRoute: '/dashboard',
		submitTransform: (val) => {
			return {...val, owner_id: getAuthUser().user_id}
		}
	});

	// data.subscribe((val) => {
	// 	console.log(val);
	// 	console.log(getAuthUser());
	// 	if (val.owner_id != getAuthUser().user_id) {
	// 		setFields('owner_id', getAuthUser().user_id);
	// 	}
	// });
</script>

<AuthLayout>
	<AuthCard title="Setup your account" subtitle={''}>
		<form class="w-full flex flex-col items-center gap-5" use:form>
			<div class="flex flex-col px-10 w-2/3">
				<PasswordInput name="pin" label="Enter your PIN" />
			</div>
			<Button>Next</Button>
		</form>
	</AuthCard>
</AuthLayout>

<LoadingPulse isLoading={$mutation.isLoading} />
