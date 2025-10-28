import { useCallback } from 'react';
import { isAxiosError } from 'axios';
import useAccountStore from '@/store/account';
import { getAmoCRMWorkspaceInfo } from '@/api/Backend/fields/workspaceInfo';
import { IAmoCRMField, IAmoCRMPipeline, IAmoCRMStatus, IAmoCRMUser } from '@/api/Backend/fields/workspaceInfo.dto';

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export const useWorkspaceInfo = () => {
  const { workspaceInfo, setWorkspaceInfo } = useAccountStore();

  const fetchWorkspaceInfo = useCallback(async (senlerGroupId: string, forceRefresh = false) => {
    const now = Date.now();
    
    // Проверяем кэш, если не принудительное обновление
    if (!forceRefresh && 
        workspaceInfo.lastFetched && 
        (now - workspaceInfo.lastFetched) < CACHE_DURATION &&
        workspaceInfo.fields.length > 0) {
      return workspaceInfo;
    }

    // Если уже загружается, не запускаем повторную загрузку
    if (workspaceInfo.isLoading) {
      return workspaceInfo;
    }

    try {
      setWorkspaceInfo({ isLoading: true, error: null });
      
      const response = await getAmoCRMWorkspaceInfo({ senlerGroupId });
      
      if (!response) {
        setWorkspaceInfo({ 
          isLoading: false, 
          error: 'Не удалось получить данные рабочего пространства' 
        });
        return workspaceInfo;
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
      return workspaceInfo;
    }
  }, [workspaceInfo, setWorkspaceInfo]);

  const clearCache = useCallback(() => {
    useAccountStore.getState().clearWorkspaceInfo();
  }, []);

  return {
    workspaceInfo,
    fetchWorkspaceInfo,
    clearCache
  };
};
