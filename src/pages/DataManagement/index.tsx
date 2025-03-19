import { useEffect, useState } from 'react'

import useAccountStore from '@/store/account'
import { useMessage } from '@/messages/messageProvider'

import { SendDataToAmoCrm, type SendDataToAmoCrmData } from './modules/SendDataToAmoCrm'
import { SendDataToSenler, type SendDataToSenlerData } from './modules/SendDataToSenler'
import { Loader } from './modules/AmoCRM/components/Loader'
import { AmoCRM } from './modules/AmoCRM'

import { SelectField } from './components/SelectField'


export enum BotStepType {
  SendDataToAmoCrm = 'SEND_DATA_TO_AMO_CRM',
  SendDataToSenler = 'SEND_DATA_TO_SENLER',
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
  const [stepType, setStepType] = useState<BotStepType>(BotStepType.SendDataToAmoCrm)

  const [publicData, setPublicData] = useState<DataManagementRouter>()
  const [privateData, setPrivateData] = useState<object>()

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
              type: stepType,
              syncableVariables,
            },
            description: 'Интеграция подключена',
            command: stepType,
            title: stepType,
          },
          success: true,
        },
        time: new Date().getTime(),
      };

      sendMessage(data, window.parent);
    };

    const handleSetData = () => {
      const { private: privatePayload, public: publicPayload } = message.request.payload;

      if (privatePayload) setPrivateData(JSON.parse(privatePayload));
      if (publicPayload) {
        const parsedPublicData = JSON.parse(publicPayload);

        setToken(parsedPublicData.token);
        setStepType(parsedPublicData.type);
        if (!parsedPublicData[BotStepType.SendDataToSenler]) { parsedPublicData[BotStepType.SendDataToSenler] = [] }

        setPublicData(parsedPublicData);
      }
      setDataIsLoaded(true)
    };

    if (!message) return;
    if (message.request?.type === 'getData') handleGetData();
    if (message.request?.type === 'setData') handleSetData();
  }, [message]);

	return (
    <div>
      <AmoCRM token={token} />
      {
        isAmoCRMAuthenticated &&
        <>
          <SelectField
            label="Тип шага"
            value={stepType}
            setValue={setStepType}
            options={[
              { label: "Отправка данных в amoCRM", value: BotStepType.SendDataToAmoCrm },
              { label: "Отправка данных в Senler", value: BotStepType.SendDataToSenler },
            ]}
          />

          {/* <InputField label="Senler Токен" value={token} setValue={setToken} /> */}

          { dataIsLoaded ? getDefaultComponent(stepType) : <Loader/> }
        </>
      }

      {/* <ServerMessage message={message} /> */}
    </div>
  )
}

