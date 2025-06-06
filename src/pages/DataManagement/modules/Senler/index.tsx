import { getUrlParams } from '@/helpers';
import SenlerAuthLink from './components/SenlerAuthButton';

import styles from './styles.module.css';
import { useState } from 'react';
import { OAuth2token } from '@/api/Senler';
import { Loader } from './components/Loader';

export const Senler = ({ token, setToken }: { token: string; setToken: React.Dispatch<React.SetStateAction<string>> }) => {
  const { senlerGroupId } = getUrlParams()
  const [isLoading, setIsLoading] = useState(false);

  const saveSenlerCode = async ({code}: {code: string}) => {
    setIsLoading(true)
    const result = await OAuth2token({
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: '6c0be2c31d56d105ce19d3e5c18311e5808cd3b2',
      redirect_uri: 'https://amocrm.senler.ru/get_senler_code',
      code: code,
    })
    setIsLoading(false)
    if (result.success) {
      setToken(result.access_token)
    }
  }

  const renderAuthLink = () => {
    return (
      <SenlerAuthLink
        clientId={'670b92d90d647d1fc4350042'}
        redirectUri={`https://amocrm.senler.ru/get_senler_code`}
        group_id={senlerGroupId}
        onAuthSuccess={saveSenlerCode}
      />
    );
  };

  const renderAuthenticatedContent = () => {
    return (
      <></>
    );
  };

  return (
    <div className={styles.container}>
      {isLoading && <Loader />}

      {!token && !isLoading && renderAuthLink()}
      {token && !isLoading && renderAuthenticatedContent()}
    </div>
  );
};

