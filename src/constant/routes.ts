import AccountData from "@/routes/Accounts/AccountData.svelte";
import LoginPage from "@/routes/Auth/LoginPage.svelte";
import RegisterCustomer from "@/routes/Auth/RegisterCustomer.svelte";
import RegisterMerchant from "@/routes/Auth/RegisterMerchant.svelte";
import DashboardAdmin from "@/routes/Dashboard/DashboardAdmin.svelte";
import NotFound from "@/routes/Error/NotFound.svelte";
import ClientRegistration from "@/routes/FIrstBoot/ClientRegistration.svelte";
import InitPage from "@/routes/FIrstBoot/InitPage.svelte";
import BeneficiaryDataAdmin from "@/routes/Transactions/BeneficiaryDataAdmin.svelte";
import TransactionDataAdmin from "@/routes/Transactions/TransactionDataAdmin.svelte";
import Customers from "@/routes/Userdata/Customers.svelte";
import Merchants from "@/routes/Userdata/Merchants.svelte";
import UserData from "@/routes/Userdata/Users.svelte";

const routes = {
  "/": InitPage,
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
  "/beneficiaries-admin": BeneficiaryDataAdmin,
  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};

export { routes };
