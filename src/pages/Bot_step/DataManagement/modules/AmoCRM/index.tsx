import { useEffect, useState } from 'react';

import { checkRegistrationAndReturnData } from '@/api/Backend/checkRegistration';
import useAccountStore from '@/store/account';
import { getUrlParams } from '@/helpers';

import AmoCRMProfile from './components/AmoCRMProfile';
import { Loader } from './components/Loader';
import { sendCode } from './helpers/sendCode';

import styles from './styles.module.css';
import { Senler } from '../../../../../shared/modules/Senler';
import AmoAuthLink, { IOnAuthSuccess } from '@/shared/modules/AmoCRM/components/AmoAuthButton';

export const AmoCRM = ({ OAuthCode, setOAuthCode }: { OAuthCode: string; setOAuthCode: React.Dispatch<React.SetStateAction<string>> }) => {
  const { isAmoCRMAuthenticated, senlerGroup, setIsAmoCRMAuthenticated, setSenlerGroup } = useAccountStore()

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { senlerGroupId } = getUrlParams();

      let isValidSign = await checkRegistrationAndReturnData({ senlerGroupId });

      if (!isValidSign.data) {
        isValidSign = await checkRegistrationAndReturnData({ senlerGroupId });
      }
      console.log('isValidSign.data', isValidSign.data)
      if (isValidSign.data) setSenlerGroup({...isValidSign.data, amoCrmDomainName: isValidSign.data.amoCrmProfile.domainName});
      setIsAmoCRMAuthenticated(isValidSign.ok);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const registerAndCheckAccess = async (code: IOnAuthSuccess) => {
    const successRegistration = await sendCode({ ...code, OAuthCode })
    if (successRegistration) {
      setIsAmoCRMAuthenticated(true)
    }
  }

  const renderAuthLink = () => {
    return (
      <>
        {
          !OAuthCode
            ? <Senler token={OAuthCode} setToken={setOAuthCode} />
            : <AmoAuthLink
                clientId={import.meta.env.VITE_CLIENT_ID || ''}
                redirectUri={`${import.meta.env.VITE_FRONT_URL}/to`}
                onAuthSuccess={registerAndCheckAccess}
              />
        }
      </>
    );
  };

  const renderAuthenticatedContent = () => {
    return (
      <AmoCRMProfile setOAuthCode={setOAuthCode} amoCrmDomainName={senlerGroup.amoCrmDomainName}/>
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

