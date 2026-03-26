import { useCallback } from 'react';
import { isAxiosError } from 'axios';

import { IAmoCRMField, IAmoCRMPipeline, IAmoCRMUser } from '@/api/Backend/fields/workspaceInfo.dto';
import { getAmoCRMWorkspaceInfo } from '@/api/Backend/fields/workspaceInfo';
import useAccountStore from '@/store/account';

const CACHE_DURATION = 5 * 60 * 1000;

let lastSyncedAmoDomain: string | null = null;

export const useWorkspaceInfo = () => {
  const workspaceInfo = useAccountStore(state => state.workspaceInfo);

  const fetchWorkspaceInfo = useCallback(async (senlerGroupId: string, forceRefresh = false) => {
    const now = Date.now();
    const currentWorkspaceInfo = useAccountStore.getState().workspaceInfo;
    const setWorkspaceInfo = useAccountStore.getState().setWorkspaceInfo;

    if (!forceRefresh &&
        currentWorkspaceInfo.lastFetched &&
        (now - currentWorkspaceInfo.lastFetched) < CACHE_DURATION &&
        currentWorkspaceInfo.fields.length > 0) {
      return currentWorkspaceInfo;
    }

    if (currentWorkspaceInfo.isLoading) {
      return currentWorkspaceInfo;
    }

    try {
      setWorkspaceInfo({ isLoading: true, error: null });

      const response = await getAmoCRMWorkspaceInfo({ senlerGroupId });

      if (!response) {
        setWorkspaceInfo({ 
          isLoading: false, 
          error: 'Не удалось получить данные рабочего пространства' 
        });
        return useAccountStore.getState().workspaceInfo;
      }

      const processedData = {
        fields: response.fields.map(field => new IAmoCRMField(field)),
        pipelines: response.pipelines.map(pipeline => new IAmoCRMPipeline(pipeline)),
        users: response.users.map(user => new IAmoCRMUser(user)),
        isLoading: false,
        error: null,
        lastFetched: now
      };

      setWorkspaceInfo(processedData);
      return processedData;

    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data.message
        : "Произошла ошибка при получении информации о рабочем пространстве AmoCRM";

      setWorkspaceInfo({
        isLoading: false,
        error: errorMessage
      });

      console.error("Error fetching workspace info:", error);
      return useAccountStore.getState().workspaceInfo;
    }
  }, []);

  const clearCache = useCallback(() => {
    useAccountStore.getState().clearWorkspaceInfo();
  }, []);

  const syncWorkspaceForAmoAccount = useCallback(
    (senlerGroupId: string | undefined, amoCrmDomainName: string | undefined, isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        lastSyncedAmoDomain = null;
        return;
      }
      if (!senlerGroupId || !amoCrmDomainName) return;

      if (lastSyncedAmoDomain === amoCrmDomainName) return;

      const previous = lastSyncedAmoDomain;
      if (previous !== null && previous !== amoCrmDomainName) {
        useAccountStore.getState().clearWorkspaceInfo();
      }
      lastSyncedAmoDomain = amoCrmDomainName;
      const forceRefresh = previous !== null && previous !== amoCrmDomainName;
      void fetchWorkspaceInfo(senlerGroupId, forceRefresh);
    },
    [fetchWorkspaceInfo]
  );

  return {
    workspaceInfo,
    fetchWorkspaceInfo,
    clearCache,
    syncWorkspaceForAmoAccount
  };
};
