<script lang="ts">
	import { UserAuthDataStore } from '@/stores/auth';
	import { push } from 'svelte-spa-router';

	UserAuthDataStore.subscribe((value) => {
		if (value.access_token) {
			console.log('yatta', value);
			switch (value.role_id) {
				case 1:
					console.log('yeet to admin dash');
					push('/dashboard-admin');
					break;
				case 2:
					console.log('yeet to cust dash');
					push('/dashboard-customer');
					break;
				case 3:
					console.log('yeet to merchant dash');
					push('/dashboard-merchant');
					break;
				default:
					console.log('yeet to unknown');
					push('/');
			}
		} else {
			push('/');
		}
	});
</script>
