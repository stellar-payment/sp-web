import { z } from 'zod';

const loginSchema = z.object({
	username: z.string().nonempty("Username can't be empty"),
	password: z.string().nonempty("Password can't be empty")
});

const userSchema = z.object({
	username: z.string().nonempty("Username can't be empty"),
	password: z.string().nonempty('Password cant empty'),
	role_id: z.string().nonempty('Role must be selected')
});

const updateUserSchema = z.object({
	username: z.string().nonempty("Username can't be empty"),
	password: z.string().nonempty("Password can't be empty")
});

const clientRegSchema = z.object({
	name: z.string().nonempty("name can't be empty"),
	phone: z.string().nonempty("phone can't be empty"),
	email: z.string().nonempty("email can't be empty"),
	address: z.string().nonempty("address can't be empty"),
	pic_name: z.string().nonempty("PIC name can't be empty"),
	pic_phone: z.string().nonempty("PIC phone can't be empty"),
	pic_email: z.string().nonempty("PIC email can't be empty"),
});


const customerSchema = z.object({
	legal_name: z.string().nonempty("legal name can't be empty"),
	phone: z.string().nonempty("phone can't be empty"),
	email: z.string().nonempty("email can't be empty"),
	birth_date: z.string().nonempty("birth date can't be empty"),
	address: z.string().nonempty("address can't be empty"),
	username: z.string().nonempty("username can't be empty"),
	password: z.string().nonempty("password can't be empty")
});

const updateCustomerSchema = z.object({
	legal_name: z.string().nonempty("legal name can't be empty"),
	phone: z.string().nonempty("phone can't be empty"),
	email: z.string().nonempty("email can't be empty"),
	birth_date: z.string().nonempty("birth date can't be empty"),
	address: z.string().nonempty("address can't be empty")
});

const merchantSchema = z.object({
	name: z.string().nonempty("name can't be empty"),
	phone: z.string().nonempty("phone can't be empty"),
	email: z.string().nonempty("email can't be empty"),
	address: z.string().nonempty("address can't be empty"),
	pic_name: z.string().nonempty("PIC name can't be empty"),
	pic_phone: z.string().nonempty("PIC phone can't be empty"),
	pic_email: z.string().nonempty("PIC email can't be empty"),
	username: z.string().nonempty("username can't be empty"),
	password: z.string().nonempty("password can't be empty")
});

const updateMerchantSchema = z.object({
	name: z.string().nonempty("name can't be empty"),
	phone: z.string().nonempty("phone can't be empty"),
	email: z.string().nonempty("email can't be empty"),
	address: z.string().nonempty("address can't be empty"),
	pic_name: z.string().nonempty("PIC name can't be empty"),
	pic_phone: z.string().nonempty("PIC phone can't be empty"),
	pic_email: z.string().nonempty("PIC email can't be empty")
});

const accountSchema = z.object({
	pin: z
		.string()
		.nonempty("pin can't be empty")
		.min(6, 'pin must have at least 6 digits')
});

const updateAccountSchema = z.object({
	owner_id: z.string(),
	account_no: z.string(),
	pin: z
		.string()
		.nonempty("pin can't be empty")
		.min(6, 'pin must have at least 6 digits')
		.transform((val) => {
			return parseInt(val, 10);
		})
});

const transactionSchema = z.object({
	account_id: z.string().optional(),
	recipient_id: z.string().optional(),
	nominal: z.string()
		.transform((val) => {
			return parseInt(val, 10);
	}),
	description: z.string().default("💀"),
})



export {
	loginSchema,
	userSchema,
	updateUserSchema,
	clientRegSchema,
	customerSchema,
	updateCustomerSchema,
	merchantSchema,
	updateMerchantSchema,
	accountSchema,
	updateAccountSchema,
	transactionSchema,
};
