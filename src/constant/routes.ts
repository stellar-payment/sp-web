import AccountData from "@/routes/Accounts/AccountData.svelte";
import LoginPage from "@/routes/Auth/LoginPage.svelte";
import RegisterCustomer from "@/routes/Auth/RegisterCustomer.svelte";
import RegisterMerchant from "@/routes/Auth/RegisterMerchant.svelte";
import DashboardAdmin from "@/routes/Dashboard/DashboardAdmin.svelte";
import NotFound from "@/routes/Error/NotFound.svelte";
import AccountFirstSetup from "@/routes/Initialization/AccountFirstSetup.svelte";
import ClientRegistration from "@/routes/Initialization/ClientRegistration.svelte";
import InitPage from "@/routes/Initialization/InitPage.svelte";
import BeneficiaryDataAdmin from "@/routes/Transactions/BeneficiaryDataAdmin.svelte";
import BeneficiaryDataMerchant from "@/routes/Transactions/BeneficiaryDataMerchant.svelte";
import SettlementDataAdmin from "@/routes/Transactions/SettlementDataAdmin.svelte";
import SettlementDataMerchant from "@/routes/Transactions/SettlementDataMerchant.svelte";
import TransactionDataAdmin from "@/routes/Transactions/TransactionDataAdmin.svelte";
import TransactionDataCustomer from "@/routes/Transactions/TransactionDataCustomer.svelte";
import TransactionDataMerchant from "@/routes/Transactions/TransactionDataMerchant.svelte";
import Customers from "@/routes/Userdata/Customers.svelte";
import Merchants from "@/routes/Userdata/Merchants.svelte";
import UserData from "@/routes/Userdata/Users.svelte";

const routes = {
  "/": InitPage,
  "/account-first-setup": AccountFirstSetup,
  "/client-register": ClientRegistration,
  "/login": LoginPage,
  "/register-merchant": RegisterMerchant,
  "/register-customer": RegisterCustomer,
  "/dashboard-admin": DashboardAdmin,
  "/users": UserData,
  "/customers": Customers,
  "/merchants": Merchants,
  "/accounts": AccountData,
  "/transactions-admin": TransactionDataAdmin,
  "/transactions-customer": TransactionDataCustomer,
  "/transactions-merchant": TransactionDataMerchant,
  "/beneficiaries-admin": BeneficiaryDataAdmin,
  "/beneficiaries-merchant": BeneficiaryDataMerchant,
  "/settlements-admin": SettlementDataAdmin,
  "/settlements-merchant": SettlementDataMerchant,
  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};

export { routes };
