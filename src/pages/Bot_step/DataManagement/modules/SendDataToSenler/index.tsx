import { memo, useEffect, useMemo, useState } from 'react'

import { useMessage } from '@/messages/messageProvider'
import { getUrlParams } from '@/helpers'
import { ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto'
import { useWorkspaceInfo } from '@/hooks/useWorkspaceInfo'

import EditableTable from '../../components/KeyValueInput'
import { ServerMessage } from '../../components/ServerMessage'

import { SendDataToSenlerData, ISendDataToSenler } from './index.types'
import { transformDataToListMessage } from '../../helpers/helpers'
import { BotStepType, SenlerFieldsResponse } from '../../types'


const SendDataToSenler = memo(({ data, setData }: ISendDataToSenler) => {
  const renderData = useMemo(() => data ? data[BotStepType.SendDataToSenler] : [], [data])

  const { workspaceInfo } = useWorkspaceInfo()
  const [senlerFields, setSenlerFields] = useState<ISenlerField[]>([])

	const { message, sendMessage } = useMessage()

  useEffect(() => {
    console.log('Rerender SendDataToSenler', data)

    const { senlerGroupId } = getUrlParams()

    if (!senlerGroupId) {
      console.error("Missing required parameters: 'sign' or 'group_id'")
      return
    }

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

	return (
    <>
      {workspaceInfo.error && (
        <div className="mb-4">
          <ServerMessage message={workspaceInfo.error} />
        </div>
      )}
      <EditableTable
        data={renderData}
        changeData={setSendDataToSenlerData}
        toFields={senlerFields}
        fromFields={workspaceInfo.fields}
        type='no-senler'
      />
    </>
  )
})

export { SendDataToSenler }
export type { SendDataToSenlerData }

