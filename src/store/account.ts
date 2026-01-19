import { create } from 'zustand';
import { IAmoCRMField, IAmoCRMPipeline, IAmoCRMUser } from '@/api/Backend/fields/workspaceInfo.dto';

interface Account {
  amoCrmDomainName: string
  id: string
  senlerGroupId: number
  senlerGroupVkId?: number
}

interface WorkspaceInfo {
  fields: IAmoCRMField[];
  pipelines: IAmoCRMPipeline[];
  users: IAmoCRMUser[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface AccountStore {
  senlerGroup: Account;
  isAmoCRMAuthenticated: boolean,
  workspaceInfo: WorkspaceInfo;
  setIsAmoCRMAuthenticated: (isAmoCRMAuthenticated: boolean) => void;
  setSenlerGroup: (senlerGroup: Account) => void;
  setWorkspaceInfo: (workspaceInfo: Partial<WorkspaceInfo>) => void;
  clearWorkspaceInfo: () => void;
}

const useAccountStore = create<AccountStore>((set) => ({
  senlerGroup: {
    amoCrmDomainName: '',
    id: '',
    senlerGroupId: 0,
    senlerGroupVkId: 0
  },
  isAmoCRMAuthenticated: false,
  workspaceInfo: {
    fields: [],
    pipelines: [],
    users: [],
    isLoading: false,
    error: null,
    lastFetched: null
  },
  setIsAmoCRMAuthenticated: (isAmoCRMAuthenticated: boolean) => set(() => {
    return isAmoCRMAuthenticated
    ? {
      isAmoCRMAuthenticated: isAmoCRMAuthenticated
    } : {
      isAmoCRMAuthenticated: isAmoCRMAuthenticated,
      senlerGroup: {
        amoCrmDomainName: '',
        id: '',
        senlerGroupId: 0,
        senlerGroupVkId: 0
      },
      workspaceInfo: {
        fields: [],
        pipelines: [],
        users: [],
        isLoading: false,
        error: null,
        lastFetched: null
      }
    }
  }),
  setSenlerGroup: (senlerGroup: Account) => set(() => ({ senlerGroup: senlerGroup })),
  setWorkspaceInfo: (workspaceInfo: Partial<WorkspaceInfo>) => set((state) => ({
    workspaceInfo: { ...state.workspaceInfo, ...workspaceInfo }
  })),
  clearWorkspaceInfo: () => set(() => ({
    workspaceInfo: {
      fields: [],
      pipelines: [],
      users: [],
      isLoading: false,
      error: null,
      lastFetched: null
    }
  })),
}));

export default useAccountStore
