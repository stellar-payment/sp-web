type UserData = {
	id: string;
	username: string;
	role_id: number;
	access_token: string;
};

type CustomerData = {
	id: string,
	user_id: string,
	legal_name: string, 
	phone: string, 
	email: string, 
	birth_date: string, 
	address: string, 
	photo_profile: string
}

type MerchantData = {
	id: string,
	user_id: string,
	name: string, 
	phone: string, 
	email: string, 
	address: string, 
	pic_name: string, 
	pic_phone: string, 
	pic_email: string, 
	photo_profile: string
}

type AccountData = {
	id: string, 
	owner_id: string, 
	owner_name: string, 
	account_type: number, 
	balance: string, 
	account_no: string,
}

type TransactionData = {
	id: number, 
	account_id: string, 
	account_name: string, 
	recipient_id: string, 
	recipient_name: string, 
	trx_type: number, 
	trx_datetime: string, 
	trx_status: string, 
	trx_fee: number, 
	nominal: number, 
	description: string,
}

type BeneficiaryData = {
	id: number, 
	merchant_id: string,
	amount: number,
	withdrawal_date: string,
	status: number,
}

export type {
    UserData,
	CustomerData,
	MerchantData,
	AccountData,
	TransactionData,
	BeneficiaryData
}