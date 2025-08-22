import { unlinkAmoAccount } from "@/api/Backend/unlinkAmoAccount"
import { getAmoCrmErrors, deleteAmoCrmErrors } from "@/api/Backend/integration"
import { getUrlParams } from "@/helpers";
import useAccountStore from "@/store/account"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AmoCRMProfile = ({amoCrmDomainName, setOAuthCode}: {amoCrmDomainName: string; setOAuthCode: React.Dispatch<React.SetStateAction<string>>}) => {
  const { setIsAmoCRMAuthenticated } = useAccountStore()
  const { senlerGroupId } = getUrlParams()
  const [errors, setErrors] = useState<string>('');

  useEffect(()=>{ setOAuthCode('') }, [])

  useEffect(() => {
    const fetchErrors = async () => {
      if (!senlerGroupId) return;
      
      try {
        const errorsData = await getAmoCrmErrors({ senlerGroupId });
        // API возвращает строку с текстовым описанием ошибки
        setErrors(errorsData || '');
      } catch (error) {
        console.error('Error fetching AmoCRM errors:', error);
        setErrors('');
      }
    };

    fetchErrors();
  }, [senlerGroupId]);

  const handleDeleteError = async () => {
    if (!senlerGroupId) return;
    
    try {
      await deleteAmoCrmErrors({ senlerGroupId: Number(senlerGroupId) });
      // Очищаем ошибку из локального состояния
      setErrors('');
    } catch (error) {
      console.error('Error deleting AmoCRM error:', error);
    }
  };

  const unlinkAmoAccountButton = () => {
    unlinkAmoAccount(senlerGroupId)
    setIsAmoCRMAuthenticated(false)
  }

  return (
    <div>
      <div className="flex justify-start p-3 flex-row">
        <div className="flex w-full items-center text-sm justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <img
              src="path/to/avatar.jpg"
              alt="Profile photo"
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
            <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>

          <div className="flex-1 text-left">
            <p className="font-medium">Аккаунт в amoCRM</p>
            <p className="text-gray-600">{amoCrmDomainName || 'account.amocrm.ru'}</p>
          </div>
        </div>
          <button onClick={unlinkAmoAccountButton} className="text-red-600 font-medium rounded-md px-4 py-2 border border-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
            Отключить
          </button>
        </div>
      </div>

      {/* Блок с ошибками AmoCRM */}
      {errors && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-3">Ошибки AmoCRM</h3>
          <div className="space-y-2">
            <div key={errors} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-md">
              <span className="text-red-700 flex-1">{errors}</span>
              <button
                onClick={handleDeleteError}
                className="ml-3 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                title="Удалить ошибку"
              >
                <FontAwesomeIcon icon="trash" className="text-danger" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmoCRMProfile
