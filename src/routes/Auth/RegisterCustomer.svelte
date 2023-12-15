<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import AuthCard from '@/components/Card/AuthCard.svelte';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import AuthLayout from '@/components/Layout/AuthLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { customerSchema } from '@/constant/schema';
	import { createMutationForm } from '@/stores/createMutationForm';
	import { push } from 'svelte-spa-router';
	import DatePicker from '@/components/Input/DatePicker.svelte';
	import { createNewCustomer } from '@/api/accounts/customers';
	import CustomInput from '@/components/Input/CustomInput.svelte';

	const {
		form: { form },
		mutation: { mutation }
	} = createMutationForm({
		mutationApi: createNewCustomer,
		formSchema: customerSchema,
		actionName: 'sign up',
		successFn: (data) => {
			push("/");
		},
	});
</script>

<AuthLayout>
	<AuthCard title="Sign Up" subtitle="Please enter your information">
		<form class="w-full flex flex-col items-center gap-5" use:form>
			<div class="flex flex-row px-10 w-full">
				<div class="flex flex-col mr-3 w-full">
					<CustomInput name="legal_name" label="Legal Name" />
					<CustomInput name="phone" label="Phone Number" />
					<CustomInput name="email" label="Email" />
					<DatePicker name="birth_date" label="Birth Date" />
				</div>
				<div class="flex flex-col ml-3 w-full">
					<CustomInput name="address" label="Address" />
					<CustomInput name="username" label="Username" />
					<PasswordInput name="password" label="Password" />
				</div>
			</div>
			<Button>Sign Up</Button>
			<div>
				<a href="/" class="text-brand-btn-main text-sm underline">already have an account?</a>
			</div>
		</form>
	</AuthCard>
</AuthLayout>

<LoadingPulse isLoading={$mutation?.isLoading} />
