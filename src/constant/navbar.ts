import Archive from '@/components/Icons/Archive.svelte';
import Backup from '@/components/Icons/Backup.svelte';
import CreditCard from '@/components/Icons/CreditCard.svelte';
import Cube from '@/components/Icons/Cube.svelte';
import Dashboard from '@/components/Icons/Dashboard.svelte';
import DocumentUpload from '@/components/Icons/DocumentUpload.svelte';
import Setting from '@/components/Icons/Setting.svelte';
import ChevronRight from '@/components/Icons/ChevronRight.svelte';
import File from '@/components/Icons/File.svelte';
import Users from '@/components/Icons/Users.svelte';

const SIDEBAR = [
	{
		key: 'Dashboard',
		route: '/dashboard-admin',
		icon: Dashboard,
		roleAccess: [0, 1],
		label: 'Dashboard',
		isClickable: true,
		subMenu: []
	},
	{
		key: 'Dashboard',
		route: '/dashboard-merchant',
		icon: Dashboard,
		roleAccess: [0, 2],
		label: 'Dashboard',
		isClickable: true,
		subMenu: []
	},
	{
		key: 'Dashboard',
		route: '/dashboard-customer',
		icon: Dashboard,
		roleAccess: [0, 3],
		label: 'Dashboard',
		isClickable: true,
		subMenu: []
	},
	{
		key: 'Userdata',
		route: '',
		icon: Users,
		roleAccess: [0, 1],
		label: 'Userdata',
		isClickable: false,
		subMenu: [
			{
				key: 'Users',
				route: '/users',
				icon: Users,
				roleAccess: [0, 1],
				label: 'Users',
				isClickable: true,
				subMenu: []
			},
			{
				key: 'Customers',
				route: '/customers',
				icon: Users,
				roleAccess: [0, 1],
				label: 'Customers',
				isClickable: true,
				subMenu: []
			},
			{
				key: 'Merchants',
				route: '/merchants',
				icon: Users,
				roleAccess: [0, 1],
				label: 'Merchants',
				isClickable: true,
				subMenu: []
			}
		]
	},
	{
		key: 'Accounts',
		route: '/accounts',
		icon: CreditCard,
		roleAccess: [0, 1],
		label: 'Accounts',
		isClickable: true,
		subMenu: []
	},
	{
		key: 'Transactional',
		route: '',
		icon: CreditCard,
		roleAccess: [0, 1],
		label: 'Transactional',
		isClickable: false,
		subMenu: [
			{
				key: 'Transactions',
				route: '/transactions-admin',
				icon: CreditCard,
				roleAccess: [0, 1],
				label: 'Transactions',
				isClickable: true,
				subMenu: []
			},
			{
				key: 'Transactions',
				route: '/transactions-merchant',
				icon: CreditCard,
				roleAccess: [0, 2],
				label: 'Transactions',
				isClickable: true,
				subMenu: []
			},
			{
				key: 'Transactions',
				route: '/transactions-customer',
				icon: CreditCard,
				roleAccess: [0, 3],
				label: 'Transactions',
				isClickable: true,
				subMenu: []
			},
			{
				key: 'Settlements',
				route: '/settlements',
				icon: CreditCard,
				roleAccess: [0, 3],
				label: 'Settlements',
				isClickable: true,
				subMenu: []
			},
			{
				key: 'Beneficiaries',
				route: '/beneficiaries-admin',
				icon: CreditCard,
				roleAccess: [0, 1],
				label: 'Beneficiaries',
				isClickable: true,
				subMenu: []
			},
			{
				key: 'Beneficiaries',
				route: '/beneficiaries-merchant',
				icon: CreditCard,
				roleAccess: [0, 3],
				label: 'Beneficiaries',
				isClickable: true,
				subMenu: []
			}
		]
	}
];

export { SIDEBAR };
