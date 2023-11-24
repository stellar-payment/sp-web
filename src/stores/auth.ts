import { get, writable, type Writable } from 'svelte/store';
import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';
import type { UserAuthData, UserStoreData } from '@/interfaces/auth.interface';
import { getUserByID } from '@/api/auth/user';
import { pick } from 'radash';
import { resetNavKey } from './navStore';
import authClient from '@/utils/authQuery';
import { getMeCustomer } from '@/api/accounts/customers';
import { getMeMerchant } from '@/api/accounts/merchants';

const defaultUserValue = {
	user_id: '',
	// username: "",
	display_name: '',
	role_id: 0,
	access_token: ''
};

export let UserAuthDataStore: Writable<UserStoreData> = writable(defaultUserValue);

UserAuthDataStore = persist(writable(defaultUserValue), createLocalStorage(true), 'sp-user-store');

export function getAuthUser() {
	return get(UserAuthDataStore);
}

export function updateAuthUser(user: UserAuthData) {
	var display_name = user.username;

	var storeData = (display_name: string) => {
		UserAuthDataStore.update(($UserAuthDataStore) => {
			$UserAuthDataStore = {
				access_token: user.access_token,
				user_id: user.user_id,
				display_name: display_name,
				role_id: user.role_id
			};
			return $UserAuthDataStore;
		});
	};

	storeData(display_name);

	if (user.role_id == 2) {
		getMeCustomer().then((meta) => storeData(meta.legal_name));
	} else if (user.role_id == 3) {
		getMeMerchant().then((meta) => storeData(meta.name));
	}
}

export function resetAuthUser() {
	UserAuthDataStore.set(defaultUserValue);
	resetNavKey();
}
