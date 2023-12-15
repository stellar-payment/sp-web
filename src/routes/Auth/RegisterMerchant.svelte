<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import AuthCard from '@/components/Card/AuthCard.svelte';
	import PasswordInput from '@/components/Input/PasswordInput.svelte';
	import AuthLayout from '@/components/Layout/AuthLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { merchantSchema } from '@/constant/schema';
	import { createMutationForm } from '@/stores/createMutationForm';
	import { push } from 'svelte-spa-router';
	import { createNewMerchant } from '@/api/accounts/merchants';
	import CustomInput from '@/components/Input/CustomInput.svelte';

	const {
		form: { form },
		mutation: { mutation }
	} = createMutationForm({
		mutationApi: createNewMerchant,
		formSchema: merchantSchema,
		actionName: 'sign up',
		successFn: (data) => {
			push('/');
		}
	});
</script>

<AuthLayout>
	<AuthCard title="Sign Up" subtitle="Please enter your information">
		<form class="w-full flex flex-col items-center gap-5" use:form>
			<div class="flex flex-row px-10 w-full">
				<div class="flex flex-col mr-3 w-full">
					<CustomInput name="name" label="Name" />
					<CustomInput name="phone" label="Phone Number" />
					<CustomInput name="email" label="Email" />
					<CustomInput name="address" label="Address" />
				</div>
				<div class="flex flex-col ml-3 w-full">
					<CustomInput name="pic_name" label="PIC Name" />
					<CustomInput name="pic_phone" label="PIC Phone Number" />
					<CustomInput name="pic_email" label="PIC Email" />
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
