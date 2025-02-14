import React, { useEffect, useState } from 'react'

import { getAmoCRMFields } from '@/api/Backend/fields'
import { useMessage } from '@/messages/messageProvider/useMessage'
import { getUrlParams } from '@/helpers'

import EditableTable, { IDataRow } from '../../components/KeyValueInput'
import { DataManagementRouter, BotStepType } from '../..'
import { IAmoCRMField } from '@/api/Backend/fields/fields.dto'
import { ISenlerField } from '../SendDataToAmoCrm/SendDataToAmoCrm.dto'

export type SendDataToSenlerData = IDataRow[]

export interface SendDataToSenler {
  data?: any,
  setData: React.Dispatch<React.SetStateAction<DataManagementRouter | undefined>>
}

export interface SenlerFieldsResponse {
    items: Array<ISenlerField>,
    success: boolean,
    count: number,
    end: boolean
}

export const SendDataToSenler = ({ data, setData }: SendDataToSenler) => {
  const [amoCRMFields, setAmoCRMFields] = useState<IAmoCRMField[]>([])
  const [senlerFields, setSenlerFields] = useState<ISenlerField[]>([])

	const { message, sendMessage } = useMessage()

  const sendListMessageData = (senlerGroupId: string) => {
    const id = Date.now() + Math.round(Math.random() * 9999);
    const data = {
      id,
      request: {
        type: "CallApiMethod",
        method: `/vars/list?group_id=${senlerGroupId}`,
      },
      time: Date.now(),
    };

    return data
  };

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

    const data = sendListMessageData(senlerGroupId)

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

  const setSendDataToSenlerData = (data: SendDataToSenlerData) => {
    setData(p => ({...p, [BotStepType.SendDataToSenler]: data }))
  }

	return (
    <>
      <EditableTable
        data={data && data[BotStepType.SendDataToSenler]}
        changeData={setSendDataToSenlerData}
        toFields={senlerFields}
        fromFields={amoCRMFields}
      />
    </>
  )
}

export { ISenlerField }

