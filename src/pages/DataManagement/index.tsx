import { useEffect, useState } from 'react'

import { useMessage } from '../../messages/messageProvider/useMessage'

import AmoAuthLink from '../../components/AmoAuthButton'
import { TextField } from './components/TextField'
import { ServerMessage } from './components/ServerMessage'

import { SelectField } from './components/SelectField'
import { SendDataToAmoCrm, type SendDataToAmoCrmData } from './modules/SendDataToAmoCrm'
import { sendCode } from './helpers/sendCode'

export enum BotStepType {
  SendDataToAmoCrm = 'SEND_DATA_TO_AMO_CRM',
  SendDataToSenler = 'SEND_DATA_TO_SENLER',
}

type SendDataToSenlerData = { }

export type DataManagementRouter = {
  [key in BotStepType]?
    : key extends BotStepType.SendDataToAmoCrm
    ? SendDataToAmoCrmData
    : key extends BotStepType.SendDataToSenler
    ? SendDataToSenlerData
    : never;
};

export const DataManagement = () => {
	const { message, sendMessage } = useMessage()

  const [token, setToken] = useState('')
  const [stepType, setStepType] = useState<BotStepType>(BotStepType.SendDataToAmoCrm)

  const [publicData, setPublicData] = useState<DataManagementRouter>()
  const [privateData, setPrivateData] = useState<object>()

  const [page, setPage] = useState(<></>)

  useEffect(()=>{

    const handler = {
      get: function (target: any, name: any) {
        return Object.prototype.hasOwnProperty.call(target, name) ? target[name] : Object.entries(target)[0];
      },
    }

    const router = new Proxy(
      {
        [BotStepType.SendDataToAmoCrm]: <SendDataToAmoCrm data={publicData} setData={setPublicData} />,
        [BotStepType.SendDataToSenler]: <>hello</>,
      },
      handler
    )

    setPage(router[stepType])
  }, [publicData, stepType])

	useEffect(() => {
		if (!message) return

		if(message?.request?.type == 'getData' ) {
      if (!publicData) return
      const syncableVariables = publicData[stepType]

			const data: any = {
				id: message.id,
				request: message.request,
				response: {
					payload: {
						private: {
							...privateData,
						},
						public: {
              ...publicData,
              token,
              type: stepType,
              syncableVariables,
						},
            description: 'description',
            command: 'command',
            title: 'title',
					},
					success: true,
				},
				time: new Date().getTime(),
			}

			sendMessage(data, window.parent)
		}

		if(message?.request?.type == 'setData' ) {
			const payload = message.request.payload

			if(payload.private) {
				setPrivateData(JSON.parse(payload.private))
			}

			if(payload.public) {
        const publicData = JSON.parse(payload.public)
        setToken(publicData?.token)
        setStepType(publicData?.type)
        setPublicData(publicData)
			}
		}
	}, [message])

	return (
		<div>
			<div style={{ width: '100%', marginBottom: '50px' }}>
				<AmoAuthLink
					clientId={import.meta.env.VITE_CLIENT_ID || ''}
					redirectUri={`${import.meta.env.VITE_REDIRECT_URI}`}
					onAuthSuccess={code => sendCode({...code, token})}
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

      { page }

			<ServerMessage message={message}/>
		</div>
	)
}

