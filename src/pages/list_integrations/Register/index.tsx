import { useState } from 'react'

import useAccountStore from '@/store/account'
import { AmoCRM } from './modules/AmoCRM'


export const Register = () => {
  const { isAmoCRMAuthenticated } = useAccountStore()
  const [OAuthCode, setOAuthCode] = useState('')

	return (
    <div>
      <AmoCRM OAuthCode={OAuthCode} setOAuthCode={setOAuthCode}/>

      {
        isAmoCRMAuthenticated &&
        <>
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            Интеграция позволит вам использовать AmoCRM в своих чат-ботах Senler.<br /><br />
            После установки в конструкторе чат-ботов добавляется шаг, позволяющий передавать подписчиков с переменными в AmoCRM и наоборот.
            <br /><br />
            Подробнее в <a href="https://help.senler.ru/senler/kanaly/vkontakte/integracii/integraciya-s-amocrm" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>документации</a>.
          </div>
        </>
      }
    </div>
  )
}
