import styles from './styles.module.css';
import AmoAuthLink from './components/AmoAuthButton';
import { sendCode } from './helpers/sendCode';
import { useEffect, useState } from 'react';
import AmoCRMProfile from './components/AmoCRMProfile';
import { Loader } from './components/Loader';
import { checkRegistration } from '../../../../api/Backend/checkRegistration';
import { getUrlParams } from '@/helpers';

const AmoCRM = ({ token }: { token: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { sign } = getUrlParams()

      const isValidSign = await checkRegistration({sign})

      setIsAuthenticated(isValidSign)
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const renderAuthLink = () => {
    return (
      <AmoAuthLink
        clientId={import.meta.env.VITE_CLIENT_ID || ''}
        redirectUri={`${import.meta.env.VITE_REDIRECT_URI}`}
        onAuthSuccess={(code) => sendCode({ ...code, token })}
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
      {!isAuthenticated && !isLoading && renderAuthLink()}
      {isAuthenticated && !isLoading && renderAuthenticatedContent()}
    </div>
  );
};

export default AmoCRM;
