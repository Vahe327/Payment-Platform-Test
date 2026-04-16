export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface Account {
  id: number;
  balance: string;
}

export interface Payment {
  id: number;
  transaction_id: string;
  account_id: number;
  amount: string;
  created_at: string;
}

export interface AdminUser extends User {
  accounts: Account[];
}

export interface AdminUserDetail extends User {
  accounts: Account[];
  payments: Payment[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
