import { getUrlParams } from '@/helpers';
import SenlerAuthLink from './components/SenlerAuthButton';
import styles from './styles.module.css';

export const Senler = ({ token, setToken }: { token: string; setToken: React.Dispatch<React.SetStateAction<string>> }) => {
  const { senlerGroupId } = getUrlParams()

  const saveSenlerCode = async ({code}: {code: string}) => {
    setToken(code)
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

  const renderAuthenticatedContent = () => <></> ;

  return (
    <div className={styles.container}>
      {!token && renderAuthLink()}
      {token&& renderAuthenticatedContent()}
    </div>
  );
};

