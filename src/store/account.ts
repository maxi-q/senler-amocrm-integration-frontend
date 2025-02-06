import { create } from 'zustand';

interface Account {
  user_id: string,
  group_id: string,
  auth: string,
  context: string
}

interface CountStore {
  account: Account;
  setAccount: () => void;
}

// использовать для sign и др.параметров

const useAccountStore = create<CountStore>((set) => ({
  account: {
    user_id: '',
    group_id: '',
    auth: '',
    context: ''
  },
  setAccount: () => set((state) => (state))
}));

export default useAccountStore
