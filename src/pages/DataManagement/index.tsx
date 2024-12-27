import { useEffect, useState } from 'react'

import { useMessage } from '../../messages/messageProvider/useMessage'

import AmoAuthLink from '../../components/AmoAuthButton'
import { TextField } from './components/TextField'
import { ServerMessage } from './components/ServerMessage'
import { sendAuthCode } from '../../api/auth/amosrm'

import styles from './styles.module.css'
import { SelectField } from './components/SelectField'
import { SendDataToAmoCrm } from './modules/SendDataToAmoCrm'

enum BotStepType {
  SendDataToAmoCrm = 'SEND_DATA_TO_AMO_CRM',
  SendDataToSenler = 'SEND_DATA_TO_SENLER',
}

export const DataManagement = () => {
	const { message, sendMessage } = useMessage()

	const [publicText, setPublicText] = useState('')
	const [privateText, setPrivateText] = useState('')
	const [token, setToken] = useState('')
	const [type, setType] = useState('')

  const [data, setData] = useState([
    { from: 'value1', to: 'value2' },
    { from: 'value3', to: 'value4' },
  ]);

  const [stepType, setStepType] = useState<BotStepType>(BotStepType.SendDataToAmoCrm)

  const router = {
    [BotStepType.SendDataToAmoCrm]: <SendDataToAmoCrm data={data} setData={setData} />,
    [BotStepType.SendDataToSenler]: <>hello</>,
  }

	const sendCode = ({ code, referer }: { code: string; referer: string }) => {
		const url = window.location.href
		const params = new URLSearchParams(new URL(url).search)
		const groupId = params.get('group_id') || ''

		sendAuthCode({
			senlerAccessToken: token,
			senlerVkGroupId: groupId,
			amoCrmDomain: referer,
			amoCrmAuthorizationCode: code
		})
	}

	useEffect(() => {
		if (!message) return

		if(message?.request?.type == 'getData' ) {
			const data: any = {
				id: message.id,
				request: message.request,
				response: {
					payload: {
						private: {
							privateText
						},
						public: {
							publicText,
							token,
              type,
              stepType
						},
            description: 'description',
            command: 'command',
            title: 'title'
					},
					success: true
				},
				time: new Date().getTime()
			}

			sendMessage(data, window.parent)
		}

		if(message?.request?.type == 'setData' ) {
			const payload = message.request.payload

			if(payload.private) {
        const privateData = JSON.parse(payload.private)

				setPrivateText(privateData?.privateText)
			}

			if(payload.public) {
        const publicData = JSON.parse(payload.public)

				setPublicText(publicData?.publicText)
				setToken(publicData?.token)
        setType(publicData?.type)
			}
		}
	}, [message])

	const handleClear = () => {
		setPublicText('');
		setPrivateText('');
	}

	return (
		<div>
			<div style={{ width: '100%', marginBottom: '50px' }}>
				<AmoAuthLink
					clientId={import.meta.env.VITE_CLIENT_ID || ''}
					redirectUri={`${import.meta.env.VITE_REDIRECT_URI}`}
					onAuthSuccess={code => sendCode(code)}
				/>
			</div>

      <SelectField label={'Тип шага'} value={stepType} setValue={setStepType} options={[
        {
          label: BotStepType.SendDataToAmoCrm,
          value: BotStepType.SendDataToAmoCrm
        },
        {
          label: BotStepType.SendDataToSenler,
          value: BotStepType.SendDataToSenler
        }
      ]}/>

      <TextField label={'Token'} value={token} setValue={setToken} />

      {
        router[stepType]
      }

			<ServerMessage message={message}/>

			<div className='flex justify-end max-w-[400px] mx-auto'>
				<button
					onClick={handleClear}
					className={styles.clearButton}
				>
					Удалить всё
				</button>
			</div>
		</div>
	)
}

