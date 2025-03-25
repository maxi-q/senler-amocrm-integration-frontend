import { create } from 'zustand';

interface Account {
  amoCrmDomainName: string
  id: string
  senlerGroupId: number
  senlerGroupVkId?: number
}

interface AccountStore {
  senlerGroup: Account;
  isAmoCRMAuthenticated: boolean,
  setIsAmoCRMAuthenticated: (isAmoCRMAuthenticated: boolean) => void;
  setSenlerGroup: (senlerGroup: Account) => void
}

const useAccountStore = create<AccountStore>((set) => ({
  senlerGroup: {
    amoCrmDomainName: '',
    id: '',
    senlerGroupId: 0,
    senlerGroupVkId: 0
  },
  isAmoCRMAuthenticated: false,
  setIsAmoCRMAuthenticated: (isAmoCRMAuthenticated: boolean) => set(() => ({ isAmoCRMAuthenticated: isAmoCRMAuthenticated })),
  setSenlerGroup: (senlerGroup: Account) => set(() => ({ senlerGroup: senlerGroup }))
}));

export default useAccountStore
