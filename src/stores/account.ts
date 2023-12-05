import { get, writable, type Writable } from 'svelte/store';
import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';
import type { UserAccountData } from '@/interfaces/auth.interface';
import { resetNavKey } from './navStore';
import { getMeAccount } from '@/api/payments/accounts';

const defaultAccountValue = {
	id: '',
	owner_id: '',
	account_type: 0,
	balance: 0,
	account_no: ''
};

export let UserAccountDataStore: Writable<UserAccountData> = writable(defaultAccountValue);

UserAccountDataStore = persist(
	writable(defaultAccountValue),
	createLocalStorage(true),
	'sp-account-store'
);

export function getUserAccount() {
	return get(UserAccountDataStore);
}

export function updateUserAccount(user: UserAccountData) {
	UserAccountDataStore.update(($UserAccountDataStore) => {
		$UserAccountDataStore = {
			id: user.id,
			owner_id: user.owner_id,
			account_type: user.account_type,
			balance: user.balance,
			account_no: user.account_no
		};
		return $UserAccountDataStore;
	});
}

export function resetAuthUser() {
	UserAccountDataStore.set(defaultAccountValue);
	resetNavKey();
}
