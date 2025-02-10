import { useEffect, useState } from 'react'

import { useMessage } from '../../messages/messageProvider/useMessage'

import { InputField } from './components/TextField'
import { ServerMessage } from './components/ServerMessage'

import { SelectField } from './components/SelectField'
import { SendDataToAmoCrm, type SendDataToAmoCrmData } from './modules/SendDataToAmoCrm'
import AmoCRM from './modules/AmoCRM'


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

  const getDefaultComponent = (type: BotStepType) => {
    switch (type) {
        case BotStepType.SendDataToAmoCrm:
            return <SendDataToAmoCrm data={publicData} setData={setPublicData} />;
        case BotStepType.SendDataToSenler:
            return <>hello</>;
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
              token,
              type: stepType,
              ...publicData,
              syncableVariables,
            },
            description: 'description',
            command: 'command',
            title: 'title',
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
        setPublicData(parsedPublicData);
      }
    };

    if (!message) return;
    if (message.request?.type === 'getData') handleGetData();
    if (message.request?.type === 'setData') handleSetData();
  }, [message]);

	return (
    <div>
      {/* AmoCRM */}
      <AmoCRM token={token} />

      <SelectField
        label="Тип шага"
        value={stepType}
        setValue={setStepType}
        options={[
          { label: BotStepType.SendDataToAmoCrm, value: BotStepType.SendDataToAmoCrm },
          { label: BotStepType.SendDataToSenler, value: BotStepType.SendDataToSenler },
        ]}
      />

      <InputField label="Token" value={token} setValue={setToken} />

      {getDefaultComponent(stepType)}

      <SendDataToAmoCrm data={publicData} setData={setPublicData} />

      <ServerMessage message={message} />
    </div>
  )
}

