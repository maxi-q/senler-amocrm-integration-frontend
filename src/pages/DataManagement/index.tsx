import { useEffect, useState } from 'react'

import useAccountStore from '@/store/account'
import { useMessage } from '@/messages/messageProvider'

import { SendDataToAmoCrm, type SendDataToAmoCrmData } from './modules/SendDataToAmoCrm'
import { SendDataToSenler, type SendDataToSenlerData } from './modules/SendDataToSenler'
import { Loader } from './modules/AmoCRM/components/Loader'
import { AmoCRM } from './modules/AmoCRM'

import { SelectField } from './components/SelectField'
import { Templates } from './components/Templates'
import { InputField } from './components/TextField'
import { MessageEditor } from './modules/AmoCRM/components/VariablesModal'


export enum BotStepType {
  SendDataToAmoCrm = 'SEND_DATA_TO_AMO_CRM',
  SendDataToSenler = 'SEND_DATA_TO_SENLER',
}

let BotStepRuName = {
  [BotStepType.SendDataToAmoCrm]: 'Отправка данных в amoCRM',
  [BotStepType.SendDataToSenler]: 'Отправка данных в senler',
}

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
  const { isAmoCRMAuthenticated } = useAccountStore()

  const [token, setToken] = useState('')
  const [vkGroupId, setVkGroupId] = useState('')

  const [stepType, setStepType] = useState<BotStepType>(BotStepType.SendDataToAmoCrm)

  const [publicData, setPublicData] = useState<DataManagementRouter>()
  const [privateData, setPrivateData] = useState<object>()

  const [transferData, setTransferData] = useState<any>()

  const [dataIsLoaded, setDataIsLoaded] = useState(false)

  const getDefaultComponent = (type: BotStepType) => {
    switch (type) {
        case BotStepType.SendDataToAmoCrm:
            return <SendDataToAmoCrm data={publicData} setData={setPublicData} />;
        case BotStepType.SendDataToSenler:
            return <SendDataToSenler data={publicData} setData={setPublicData} />;
        default:
            return <>Тип не передан</>;
    }
  };

  useEffect(()=>{
    setTransferData(
      {
        private: { ...privateData },
        public: {
          ...publicData,
          token,
          vkGroupId,
          type: stepType,
          syncableVariables: publicData && publicData[stepType] ,
        }
      }
    )
  }, [publicData, privateData])

  const handleSetData = (mockMessage?: { private: any, public: any }) => {
    let { private: privatePayload, public: publicPayload } = mockMessage ? mockMessage : message.request.payload;

    if (!mockMessage) {
      privatePayload = JSON.parse(privatePayload)
      publicPayload = JSON.parse(publicPayload)
    }

    console.log('mockMessage', mockMessage)

    if (privatePayload) setPrivateData(privatePayload);
    if (publicPayload) {
      const parsedPublicData = publicPayload;

      setToken(parsedPublicData.token);
      setVkGroupId(parsedPublicData.vkGroupId);
      setStepType(parsedPublicData.type);
      if (!parsedPublicData[BotStepType.SendDataToSenler]) { parsedPublicData[BotStepType.SendDataToSenler] = [] }

      setPublicData(parsedPublicData);
    }

    setDataIsLoaded(true)
  };

	useEffect(() => {
    const handleGetData = () => {
      if (!publicData) return;
      const syncableVariables = publicData[stepType];

      const data = {
        id: message.id,
        request: message.request,
        response: {
          payload: {
            private: { ...privateData },
            public: {
              ...publicData,
              token,
              vkGroupId,
              type: stepType,
              syncableVariables,
            },
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

  // const [messageContent, setMessageContent] = useState('');

  // const handleContentChange = (content: string) => {
  //   console.log('New content:', content);
  //   setMessageContent(content);
  // };

	return (
    <div>
      <AmoCRM token={token} />
      { !isAmoCRMAuthenticated && <InputField label="Senler Токен" value={token} setValue={setToken} /> }
      {
        isAmoCRMAuthenticated &&
        <>
          <Margin/>

          <Templates data={transferData} setData={handleSetData}/>
          <Margin/>

          {/* <MessageEditor
            initialContent={messageContent}
            onContentChange={handleContentChange}
          />

          <div className="mt-4 p-4 border rounded">
            <h2 className="text-lg mb-2">Предпросмотр:</h2>
            <div className="whitespace-pre-wrap">{messageContent}</div>
          </div>

          <Margin/> */}

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
            { dataIsLoaded ? getDefaultComponent(stepType) : <Loader/> }
          </div>
        </>
      }

      {/* <ServerMessage message={message} /> */}
    </div>
  )
}

const Margin = () => <div className='w-full my-10'/>
