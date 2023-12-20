interface DashboardGraph {
	key: any;
	value: number;
}

interface TrxMetaDashboard {
	sender_name: string;
	recipient_name: string;
	nominal: number;
	trx_date: string;
	trx_type: number;
}

interface AdminDashboard {
	peer_trx_count: number;
	merchant_trx_count: number;
	system_trx_count: number;
	total_customers: number;
	total_merchants: number;
	trx_traffic: Array<DashboardGraph>;
}

interface MerchantDashboard {
	account_id: string;
	account_balance: number;
	trx_count: number;
	trx_nominal: number;
	settlement_nominal: number;
	beneficiary_nominal: number;
	last_trx: Array<TrxMetaDashboard>;
	trx_traffic: Array<DashboardGraph>;
}

interface CustomerDashboard {
	account_id: string;
	account_balance: number;
	peer_trx_count: number;
	peer_trx_nominal: number;
	merchant_trx_count: number;
	merchant_trx_nominal: number;
	last_trx: Array<TrxMetaDashboard>;
	trx_traffic: Array<DashboardGraph>;
}
