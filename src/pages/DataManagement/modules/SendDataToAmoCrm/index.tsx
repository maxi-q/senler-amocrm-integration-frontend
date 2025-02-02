import EditableTable, { IDataRow } from '../../components/KeyValueInput'
import React, { useEffect, useState } from 'react'

import { getAmoCRMFields } from '@/api/Backend/fields'
import { DataManagementRouter, BotStepType } from '../..'
import { useMessage } from '@/messages/messageProvider/useMessage'

export type SendDataToAmoCrmData = IDataRow[]

interface SendDataToAmoCrm {
  data?: any,
  setData: React.Dispatch<React.SetStateAction<DataManagementRouter | undefined>>
}

interface SenlerFieldsResponseDto {
    items: Array<
        {
            id: string,
            text: string,
            contain: string,
            selected: boolean,
            disabled: boolean
        }
    >,
    success: boolean,
    count: number,
    end: boolean
}

export const SendDataToAmoCrm = (props: SendDataToAmoCrm) => {
  const [amoCRMFields, setAmoCRMFields] = useState({})
  const [senlerFields, setSenlerFields] = useState({})

	const { message, sendMessage } = useMessage()


  useEffect(() => {
    const url = window.location.href
    const params = new URLSearchParams(new URL(url).search)

    const sign = params.get('sign') || '';
    const senlerGroupId = params.get('group_id') || '';

    (async () => {
      if (!sign || !senlerGroupId) {
        console.error("Missing required parameters: 'sign' or 'group_id'")
        return
      }

      try {
        const amoFields = await getAmoCRMFields({ sign })

        setAmoCRMFields(amoFields)
      } catch (error) {
        console.error("Error fetching data:")
        throw error
      }
    })()

    const id = new Date().getTime() + Math.round(Math.random() * 9999);

    const data = {
      id: id,
      request: {
        "type": "CallApiMethod",
        "method": `/vars/list?group_id=${senlerGroupId}`,
      },
      time: new Date().getTime(),
    };

    sendMessage(data, window.parent);
  }, [])

  useEffect(() =>{
    const handleSetSenlerFields = () => {
      const senlerFieldsResponse: SenlerFieldsResponseDto = message.request.payload;
      setSenlerFields(senlerFieldsResponse)
    };

    if (!message) return;
    if (message.request?.type === 'CallApiMethod') handleSetSenlerFields();
  }, [message])

  useEffect(() => {
    console.log(amoCRMFields, senlerFields)
  }, [amoCRMFields, senlerFields])

  const setSendDataToAmoCrmData = (data: SendDataToAmoCrmData) => {
    props.setData(p => ({...p, [BotStepType.SendDataToAmoCrm]: data }))
  }

	return <EditableTable data={props.data && props.data[BotStepType.SendDataToAmoCrm]} changeData={setSendDataToAmoCrmData} />
}

