import React, { useEffect, useState } from 'react'

import { IAmoCRMField, getAmoCRMFields } from '@/api/Backend/fields'
import { useMessage } from '@/messages/messageProvider/useMessage'
import { getUrlParams } from '@/helpers'

import EditableTable, { IDataRow } from '../../components/KeyValueInput'
import { DataManagementRouter, BotStepType } from '../..'

export type SendDataToAmoCrmData = IDataRow[]

export interface SendDataToAmoCrm {
  data?: any,
  setData: React.Dispatch<React.SetStateAction<DataManagementRouter | undefined>>
}

export interface ISenlerField {
  id: string,
  text: string,
  contain: string,
  selected: boolean,
  disabled: boolean
}

export interface SenlerFieldsResponse {
    items: Array<ISenlerField>,
    success: boolean,
    count: number,
    end: boolean
}

export const SendDataToAmoCrm = ({data, setData}: SendDataToAmoCrm) => {
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
      setAmoCRMFields(amoFields);
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
      setSenlerFields(senlerFieldsResponse.items)
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
      amoCRMFields={amoCRMFields}
      senlerFields={senlerFields}
    />
)
}

