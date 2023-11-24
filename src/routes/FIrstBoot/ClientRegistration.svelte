<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import AuthCard from '@/components/Card/AuthCard.svelte';
	import AuthLayout from '@/components/Layout/AuthLayout.svelte';
	import LoadingPulse from '@/components/Loading/LoadingPulse.svelte';
	import { clientRegSchema } from '@/constant/schema';
	import { createMutationForm } from '@/stores/createMutationForm';
	import { push } from 'svelte-spa-router';
	import { invoke } from '@tauri-apps/api/tauri';
	import CustomInput from '@/components/Input/CustomInput.svelte';
	import { registerClient } from '@/api/auth/registration';

	const {
		form: { form },
		mutation: { mutation }
	} = createMutationForm({
		mutationApi: registerClient,
		formSchema: clientRegSchema,
		actionName: 'client registration',
		callbackRoute: '/login'
	});

	let progress = '';
</script>

<AuthLayout>
	<AuthCard title="Stellar Payment" subtitle={progress}>
		{#await invoke('handle_is_registered') then status}
			{#if status == true}
				{push('/')}
			{/if}
		{/await}

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
				</div>
			</div>
			<Button>Register this device</Button>
		</form>
	</AuthCard>
</AuthLayout>

<LoadingPulse isLoading={$mutation?.isLoading} />
