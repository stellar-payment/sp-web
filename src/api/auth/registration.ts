import type { ClientRegisterData } from '@/interfaces/auth.interface';
import { invoke } from '@tauri-apps/api/tauri';

const registerClient = async (clientData: ClientRegisterData) => {
	try {
		clientData.partner_secret = "1234"
		const res = await invoke('handle_register_partner', { payload: clientData });

		return { data: res };
	} catch (e) {
		console.log('err', e);
		return Promise.reject(Error(e as string))
	}
};

export { registerClient };
