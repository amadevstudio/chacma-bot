export interface UserWithAccountsWithType {
  id: number;

  accounts: AccountWithType[];
}

interface AccountType {
  id: number;
  type: 'telegram';
}

interface AccountWithType {
  id: number;
  userId: number;
  accountTypeId: number;
  accountId: string;
  languageCode: string | null;

  accountType: AccountType;
}
