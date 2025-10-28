import { memo, useEffect, useMemo, useState } from 'react'

import { useMessage } from '@/messages/messageProvider'
import { getUrlParams } from '@/helpers'
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto'
import { getAmoCRMWorkspaceInfo } from '@/api/Backend/fields/workspaceInfo'

import EditableTable from '../../components/KeyValueInput'
import { ServerMessage } from '../../components/ServerMessage'

import { SendDataToSenlerData, ISendDataToSenler } from './index.types'
import { transformDataToListMessage } from '../../helpers/helpers'
import { BotStepType, SenlerFieldsResponse } from '../../types'
import { isAxiosError } from 'axios'


const SendDataToSenler = memo(({ data, setData }: ISendDataToSenler) => {
  const renderData = useMemo(() => data ? data[BotStepType.SendDataToSenler] : [], [data])

  const [amoCRMFields, setAmoCRMFields] = useState<IAmoCRMField[]>([])
  const [senlerFields, setSenlerFields] = useState<ISenlerField[]>([])
  const [error, setError] = useState<string | null>(null)

	const { message, sendMessage } = useMessage()

  const getOrThrowAmoCRMFields = async (senlerGroupId: string) => {
    try {
      setError('')

      const { fields } = await getAmoCRMWorkspaceInfo({ senlerGroupId })
      if (!fields) return
      setAmoCRMFields(fields.map(field => new IAmoCRMField(field)))
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data.message)
      } else {
        setError("Произошла ошибка при получении полей AmoCRM")
      }
      console.error("Error fetching amoCRM fields in SendDataToSenler:", error);
    }
  };

  useEffect(() => {
    console.log('Rerender SendDataToSenler', data)

    const { senlerGroupId } = getUrlParams()

    if (!senlerGroupId) {
      console.error("Missing required parameters: 'sign' or 'group_id'")
      return
    }

    getOrThrowAmoCRMFields(senlerGroupId)
    const _data = transformDataToListMessage(senlerGroupId)
    sendMessage(_data, window.parent)
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

  const clearError = () => {
    setError(null)
  }

	return (
    <>
      {error && (
        <div className="mb-4">
          <ServerMessage message={error} onClose={clearError} />
        </div>
      )}
      <EditableTable
        data={renderData}
        changeData={setSendDataToSenlerData}
        toFields={senlerFields}
        fromFields={amoCRMFields}
        type='no-senler'
      />
    </>
  )
})

export { SendDataToSenler }
export type { SendDataToSenlerData }

