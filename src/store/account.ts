import { create } from 'zustand';

interface Account {
  user_id: string,
  group_id: string,
  auth: string,
  context: string
}

interface AccountStore {
  account: Account;
  isAmoCRMAuthenticated: boolean,
  setIsAmoCRMAuthenticated: (isAmoCRMAuthenticated: boolean) => void;
}

// использовать для sign и др.параметров

const useAccountStore = create<AccountStore>((set) => ({
  account: {
    user_id: '',
    group_id: '',
    auth: '',
    context: ''
  },
  isAmoCRMAuthenticated: false,
  setIsAmoCRMAuthenticated: (isAmoCRMAuthenticated: boolean) => set(() => ({ isAmoCRMAuthenticated: isAmoCRMAuthenticated }))
}));

export default useAccountStore
