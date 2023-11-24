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
	import { invoke } from '@tauri-apps/api/tauri';

	let progress = '';
</script>

<AuthLayout>
	<AuthCard title="Stellar Payment" subtitle={progress}>
		{#await invoke('ping_backend')}
			{(progress = 'checking internet connection...')}
		{:then msg}
			{#if msg != ''}
				<div>{msg}</div>
			{:else}
				{#await invoke('handle_is_registered') then status}
					{#if status == false}
						<Button onClick={() => push('/client-register')}>Register Client</Button>
					{:else}
						{push('/login')}
					{/if}
				{/await}
			{/if}
		{/await}
	</AuthCard>
</AuthLayout>
