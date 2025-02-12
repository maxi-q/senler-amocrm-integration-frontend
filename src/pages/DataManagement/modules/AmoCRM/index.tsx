import styles from './styles.module.css';
import AmoAuthLink, { IOnAuthSuccess } from './components/AmoAuthButton';
import { sendCode } from './helpers/sendCode';
import { useEffect, useState } from 'react';
import AmoCRMProfile from './components/AmoCRMProfile';
import { Loader } from './components/Loader';
import { checkRegistration } from '../../../../api/Backend/checkRegistration';
import { getUrlParams } from '@/helpers';
import useAccountStore from '@/store/account';

const AmoCRM = ({ token }: { token: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAmoCRMAuthenticated, setIsAmoCRMAuthenticated } = useAccountStore()

  useEffect(() => {
    const checkAuth = async () => {
      const { sign } = getUrlParams()

      const isValidSign = await checkRegistration({sign})

      setIsAmoCRMAuthenticated(isValidSign)
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const RegisterAndCheckAccess = async (code: IOnAuthSuccess) => {
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
        onAuthSuccess={RegisterAndCheckAccess}
      />
    );
  };

  const renderAuthenticatedContent = () => {
    return (
      <AmoCRMProfile />
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

export default AmoCRM;
