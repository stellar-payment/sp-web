<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import AuthCard from '@/components/Card/AuthCard.svelte';
	import AuthLayout from '@/components/Layout/AuthLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { accountSchema } from '@/constant/schema';
	import { createMutationForm } from '@/stores/createMutationForm';
	import { createNewAccount } from '@/api/payments/accounts';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import { UserAuthDataStore, getAuthUser } from '@/stores/auth';
	import { push } from 'svelte-spa-router';

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

	UserAuthDataStore.subscribe((value) => {
		if (!value.access_token) {
			push("/")
		}
	});
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
