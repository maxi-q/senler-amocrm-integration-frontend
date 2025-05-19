import { useEffect, useState } from 'react'

import { useMessage } from '@/messages/messageProvider'
import { getUrlParams } from '@/helpers'
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/fields.dto'
import { getAmoCRMFields } from '@/api/Backend/fields'

import EditableTable from '../../components/KeyValueInput'

import { BotStepType } from '../..'

import { SendDataToSenlerData, ISendDataToSenler } from './index.types'
import { transformDataToListMessage } from '../../helpers/helpers'
import { SenlerFieldsResponse } from '../../types'


const SendDataToSenler = ({ data, setData }: ISendDataToSenler) => {
  const [amoCRMFields, setAmoCRMFields] = useState<IAmoCRMField[]>([])
  const [senlerFields, setSenlerFields] = useState<ISenlerField[]>([])

	const { message, sendMessage } = useMessage()

  const getOrThrowAmoCRMFields = async (senlerGroupId: string) => {
    try {
      const amoFields = await getAmoCRMFields({ senlerGroupId })

      if (!Array.isArray(amoFields)) {
        throw new Error('amoFields is not an array')
      }

      setAmoCRMFields(amoFields.map(field => new IAmoCRMField(field)))
    } catch (error) {
      console.error("Error fetching amoCRM fields:", error)
      throw error
    }
  };

  useEffect(() => {
    const { senlerGroupId } = getUrlParams()

    if (!senlerGroupId) {
      console.error("Missing required parameters: 'sign' or 'group_id'")
      return
    }

    getOrThrowAmoCRMFields(senlerGroupId)
    const data = transformDataToListMessage(senlerGroupId)
    sendMessage(data, window.parent)
  }, [])

  useEffect(() =>{
    const handleSetSenlerFields = () => {
      const senlerFieldsResponse: SenlerFieldsResponse = message.response.payload;
      setSenlerFields(senlerFieldsResponse.items.map(field => new ISenlerField(field)))
    }

    if (!message) return
    if (message.request?.type === 'CallApiMethod') handleSetSenlerFields()
  }, [message])

  const setSendDataToSenlerData = (data: SendDataToSenlerData) => {
    setData(p => ({...p, [BotStepType.SendDataToSenler]: data }))
  }

	return (
    <EditableTable
      data={data && data[BotStepType.SendDataToSenler]}
      changeData={setSendDataToSenlerData}
      toFields={senlerFields}
      fromFields={amoCRMFields}
      type='no-senler'
    />
  )
}

export { SendDataToSenler }
export type { SendDataToSenlerData }

