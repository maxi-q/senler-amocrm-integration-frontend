import { unlinkAmoAccount } from "@/api/Backend/unlinkAmoAccount"
import { getAmoCrmErrors, deleteAmoCrmErrors } from "@/api/Backend/integration"
import { getUrlParams } from "@/helpers";
import useAccountStore from "@/store/account"
import { useEffect, useState } from "react";

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
        <div
          style={{
            maxWidth: '500px',
            padding: '20px',
            border: '1px solid #f56565',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            margin: '20px auto',
            position: 'relative',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Ошибки AmoCRM</h4>
              <div className="text-sm whitespace-pre-line">{errors}</div>
            </div>
            <button
              onClick={handleDeleteError}
              className="ml-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              style={{ fontSize: '18px', lineHeight: '1' }}
              title="Удалить ошибку"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmoCRMProfile
