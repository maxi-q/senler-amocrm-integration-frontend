import { useEffect, useState } from 'react'

import { getAmoCRMFields } from '@/api/Backend/fields'
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/fields.dto'
import { useMessage } from '@/messages/messageProvider'
import { getUrlParams } from '@/helpers'

import { ISendDataToAmoCrm, SendDataToAmoCrmData } from './index.types'
import EditableTable from '../../components/KeyValueInput'
import { BotStepType } from '../..'
import { transformDataToListMessage } from '../../helpers/helpers'
import { SenlerFieldsResponse } from '../../types'

const SendDataToAmoCrm = ({data, setData}: ISendDataToAmoCrm) => {
  const [amoCRMFields, setAmoCRMFields] = useState<IAmoCRMField[]>([])
  const [senlerFields, setSenlerFields] = useState<ISenlerField[]>([])

	const { message, sendMessage } = useMessage()

  const getOrThrowAmoCRMFields = async (sign: string) => {
    try {
      const amoFields = await getAmoCRMFields({ sign });

      if (!Array.isArray(amoFields)) {
        throw new Error('amoFields is not an array');
      }

      setAmoCRMFields(amoFields.map(field => new IAmoCRMField(field)));
    } catch (error) {
      console.error("Error fetching amoCRM fields:", error);
      throw error;
    }
  };

  useEffect(() => {
    const { sign, senlerGroupId } = getUrlParams();

    if (!sign || !senlerGroupId) {
      console.error("Missing required parameters: 'sign' or 'group_id'");
      return;
    }

    getOrThrowAmoCRMFields(sign);

    const data = transformDataToListMessage(senlerGroupId)

    sendMessage(data, window.parent);
  }, [])

  useEffect(() =>{
    const handleSetSenlerFields = () => {
      const senlerFieldsResponse: SenlerFieldsResponse = message.response.payload;
      setSenlerFields(senlerFieldsResponse.items.map(field => new ISenlerField(field)))
    };

    if (!message) return;
    if (message.request?.type === 'CallApiMethod') handleSetSenlerFields();
  }, [message])

  const setSendDataToAmoCrmData = (data: SendDataToAmoCrmData) => {
    setData(p => ({...p, [BotStepType.SendDataToAmoCrm]: data }))
  }

	return (
    <EditableTable
      data={data && data[BotStepType.SendDataToAmoCrm]}
      changeData={setSendDataToAmoCrmData}
      toFields={amoCRMFields}
      fromFields={senlerFields}
    />
  )
}

export { SendDataToAmoCrm }
export type { SendDataToAmoCrmData }

