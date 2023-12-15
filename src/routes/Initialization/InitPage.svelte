<script lang="ts">
	import Button from '@/components/Button/Button.svelte';
	import AuthCard from '@/components/Card/AuthCard.svelte';
	import AuthLayout from '@/components/Layout/AuthLayout.svelte';
	import { push } from 'svelte-spa-router';
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
