import { useEffect, useState } from 'react'

import useAccountStore from '@/store/account'
import { useMessage } from '@/messages/messageProvider'
import { useWorkspaceInfo } from '@/hooks/useWorkspaceInfo'
import { getUrlParams } from '@/helpers'

import { SendDataToAmoCrm } from './modules/AmoCRM/SendDataToAmoCrm'
import { SendDataToSenler } from './modules/SendDataToSenler'
import { Loader } from './modules/Register/components/Loader'
import { AmoCRM } from './modules/Register'

import { SelectField } from './components/SelectField'
import { Templates } from './components/Templates'
import { AmoCrmTransferringSettings, BotStepRuName, BotStepType, DataManagementRouter, IPublicTransferData, isPublicTransferData, ITransferData } from './types'


export const DataManagement = () => {
	const { message, sendMessage } = useMessage()
  const { isAmoCRMAuthenticated } = useAccountStore()
  const { fetchWorkspaceInfo } = useWorkspaceInfo()

  const [OAuthCode, setOAuthCode] = useState('')

  const [stepType, setStepType] = useState<BotStepType>(BotStepType.SendDataToAmoCrm)

  const [publicData, setPublicData] = useState<DataManagementRouter>()

  const [transferData, setTransferData] = useState<ITransferData>()
  const [dataIsLoaded, setDataIsLoaded] = useState(false)

  const [amoCrmTransferringSettings, setAmoCrmTransferringSettings] = useState<AmoCrmTransferringSettings | null>(null)

  // Загружаем workspaceInfo при аутентификации
  useEffect(() => {
    if (isAmoCRMAuthenticated) {
      const { senlerGroupId } = getUrlParams()
      if (senlerGroupId) {
        fetchWorkspaceInfo(senlerGroupId)
      }
    }
  }, [isAmoCRMAuthenticated, fetchWorkspaceInfo])


  useEffect(() => {
    let settings = amoCrmTransferringSettings

    if ( amoCrmTransferringSettings && settings) {
      for (const [key, value] of Object.entries(amoCrmTransferringSettings)) {
        if (value) {
          settings[key as keyof AmoCrmTransferringSettings] = value
        }
      }

      settings = Object.keys(settings).length === 0 ? null : settings
    }

    setTransferData(
      {
        public: {
          ...publicData,
          type: stepType,
          syncableVariables: publicData && publicData[stepType] || [],
          amoCrmTransferringSettings: settings
        }
      }
    )
  }, [publicData, stepType, amoCrmTransferringSettings])

  const handleSetData = (mockMessage?: ITransferData) => {
    let { public: publicPayload } = mockMessage ? mockMessage : message.request.payload;

    if (!mockMessage) {
      try {
        publicPayload = JSON.parse(publicPayload || '{}')
      } catch (error) {
        publicPayload = {}
      }
    }

    if (isPublicTransferData(publicPayload)) {
      const parsedPublicData = publicPayload;

      setAmoCrmTransferringSettings(parsedPublicData.amoCrmTransferringSettings)
      setOAuthCode('');
      setStepType(parsedPublicData.type || BotStepType.SendDataToAmoCrm);
      if (!parsedPublicData[BotStepType.SendDataToSenler]) { parsedPublicData[BotStepType.SendDataToSenler] = [] }

      setPublicData(parsedPublicData);
    }

    setDataIsLoaded(true)
  };

	useEffect(() => {
    const handleGetData = () => {
      if (!publicData) return;
      const syncableVariables = publicData[stepType] || [];

      const publicPayload: IPublicTransferData = {
        ...publicData,
        type: stepType,
        syncableVariables,
        amoCrmTransferringSettings
      }

      const data = {
        id: message.id,
        request: message.request,
        response: {
          payload: {
            public: publicPayload,
            description: 'Интеграция подключена',
            command: BotStepRuName[stepType],
            title: BotStepRuName[stepType],
          },
          success: true,
        },
        time: new Date().getTime(),
      };

      sendMessage(data, window.parent);
    };

    if (!message) return;
    if (message.request?.type === 'getData') handleGetData();
    if (message.request?.type === 'setData') handleSetData();
  }, [message]);

	return (
    <div>
      <AmoCRM OAuthCode={OAuthCode} setOAuthCode={setOAuthCode}/>

      {
        isAmoCRMAuthenticated &&
        <>
          <Margin/>

          <Templates data={transferData} setData={handleSetData}/>
          <Margin/>

          <div className='text-left'>
            <h3>Направление передачи данных</h3>
            <SelectField
              value={stepType}
              setValue={setStepType}
              options={[
                { label: "Отправка данных в amoCRM", value: BotStepType.SendDataToAmoCrm },
                { label: "Отправка данных в Senler", value: BotStepType.SendDataToSenler },
              ]}
            />
          </div>

          <div className='mt-8 relative'>
            {
              dataIsLoaded ?
              <>
                {stepType == BotStepType.SendDataToAmoCrm && <SendDataToAmoCrm data={publicData} setData={setPublicData} amoCrmTransferringSettings={amoCrmTransferringSettings} setAmoCrmTransferringSettings={setAmoCrmTransferringSettings} />}
                {stepType == BotStepType.SendDataToSenler && <SendDataToSenler data={publicData} setData={setPublicData} />}
              </> :
              <Loader/>
            }
          </div>
        </>
      }
    </div>
  )
}

const Margin = () => <div className='w-full my-10'/>
