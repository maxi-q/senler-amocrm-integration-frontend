import { useEffect, useState } from 'react';

import { checkRegistrationAndReturnData } from '@/api/Backend/checkRegistration';
import useAccountStore from '@/store/account';
import { getUrlParams } from '@/helpers';

import AmoAuthLink, { IOnAuthSuccess } from './components/AmoAuthButton';
import AmoCRMProfile from './components/AmoCRMProfile';
import { Loader } from './components/Loader';
import { sendCode } from './helpers/sendCode';

import styles from './styles.module.css';

export const AmoCRM = ({ token }: { token: string; }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAmoCRMAuthenticated, senlerGroup, setIsAmoCRMAuthenticated, setSenlerGroup } = useAccountStore()

  useEffect(() => {
    const checkAuth = async () => {
      const { senlerGroupId } = getUrlParams()

      const isValidSign = await checkRegistrationAndReturnData({senlerGroupId})

      if (isValidSign.data) setSenlerGroup(isValidSign.data)
      setIsAmoCRMAuthenticated(isValidSign.ok)
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const registerAndCheckAccess = async (code: IOnAuthSuccess) => {
    const successRegistration = await sendCode({ ...code, token })
    if (successRegistration) {
      setIsAmoCRMAuthenticated(true)
    }
  }

  const renderAuthLink = () => {
    return (
      <AmoAuthLink
        clientId={import.meta.env.VITE_CLIENT_ID || ''}
        redirectUri={`${import.meta.env.VITE_REDIRECT_URI}`}
        onAuthSuccess={registerAndCheckAccess}
      />
    );
  };

  const renderAuthenticatedContent = () => {
    return (
      <AmoCRMProfile amoCrmDomainName={senlerGroup.amoCrmDomainName}/>
    );
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loader />}
      {!isAmoCRMAuthenticated && !isLoading && renderAuthLink()}
      {isAmoCRMAuthenticated && !isLoading && renderAuthenticatedContent()}
    </div>
  );
};

