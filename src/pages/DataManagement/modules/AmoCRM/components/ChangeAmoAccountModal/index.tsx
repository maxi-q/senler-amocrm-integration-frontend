import { useState } from 'react';
import AmoAuthLink, { IOnAuthSuccess } from '../AmoAuthButton';
import { changeAmoAccount } from '@/api/Backend/unlinkAmoAccount';
import { checkRegistrationAndReturnData } from '@/api/Backend/checkRegistration';
import { getUrlParams } from '@/helpers';
import useAccountStore from '@/store/account';

interface ChangeAmoAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeAmoAccountModal = ({ isOpen, onClose }: ChangeAmoAccountModalProps) => {
  const { setSenlerGroup } = useAccountStore();
  const { senlerGroupId } = getUrlParams();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSuccess = async ({ code, referer }: IOnAuthSuccess) => {
    setIsLoading(true);

    try {
      const result = await changeAmoAccount({
        senlerGroupId,
        amoCrmDomainName: referer,
        amoCrmAuthorizationCode: code
      });

      if (result.ok) {
        const isValidSign = await checkRegistrationAndReturnData({senlerGroupId});
        if (isValidSign.data) setSenlerGroup({...isValidSign.data, amoCrmDomainName: isValidSign.data.amoCrmProfile.domainName});
        onClose();
      } else {
        console.error('Failed to change AmoCRM account');
      }
    } catch (error) {
      console.error('Error changing AmoCRM account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: string) => {
    console.error('Auth error:', error);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full bg-white flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Смена аккаунта AmoCRM</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Обработка авторизации...</p>
            </div>
          ) : (
            <div className="text-center max-w-md">
              <h3 className="text-lg font-medium mb-4">
                Подключите новый аккаунт AmoCRM
              </h3>
              <AmoAuthLink
                clientId={import.meta.env.VITE_CLIENT_ID || ''}
                redirectUri={`${import.meta.env.VITE_REDIRECT_URI}`}
                onAuthSuccess={handleAuthSuccess}
                onAuthError={handleAuthError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeAmoAccountModal;
