<script lang="ts">
	import { login } from '@/api/auth/auth';
	import Button from '@/components/Button/Button.svelte';
	import AuthCard from '@/components/Card/AuthCard.svelte';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import AuthLayout from '@/components/Layout/AuthLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { loginSchema } from '@/constant/schema';
	import { updateAuthUser, UserAuthDataStore } from '@/stores/auth';
	import { createMutationForm } from '@/stores/createMutationForm';
	import { push } from 'svelte-spa-router';
	import Input from '@/components/Input/Input.svelte';
	import { getMeAccount } from '@/api/payments/accounts';
	import { updateUserAccount } from '@/stores/account';
	import type { UserAuthData } from '@/interfaces/auth.interface';

	const {
		form: { form },
		mutation: { mutation }
	} = createMutationForm({
		mutationApi: login,
		formSchema: loginSchema,
		actionName: 'Login',
		successFn: (data: UserAuthData) => {
			updateAuthUser(data);
		},
		callbackRoute: '/dashboard'
	});

	UserAuthDataStore.subscribe((value) => {
		if (value.access_token) {
			if (value.role_id > 1) {
				getMeAccount().then((meta) => {
					console.log(meta)
					return updateUserAccount(meta)
				}).catch((e) => {
					push("/account-first-setup")
				});
			} else {
				push("/dashboard")
			}
		}
	});
</script>

<AuthLayout>
	<AuthCard title="Login" subtitle="Welcome to Stellar Payment">
		<form class="w-full flex flex-col items-center gap-5" use:form>
			<Input name="username" label="Username" />
			<PasswordInput name="password" label="Password" />
			<Button>Login</Button>
		</form>
		<div>
			<a href="/#/register-merchant" class="text-brand-btn-main text-sm underline"
				>Register as Merchant</a
			>
			<a href="/#/register-customer" class="text-brand-btn-main text-sm underline"
				>Register as Customer</a
			>
		</div>
	</AuthCard>
</AuthLayout>

<LoadingPulse isLoading={$mutation?.isLoading} />
