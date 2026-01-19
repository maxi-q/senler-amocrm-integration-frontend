  import { memo, useEffect, useMemo, useState } from 'react'

  import { ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto'
  import { useMessage } from '@/messages/messageProvider'
  import { useWorkspaceInfo } from '@/hooks/useWorkspaceInfo'
  import { getUrlParams } from '@/helpers'

  import { ISendDataToAmoCrm, SendDataToAmoCrmData } from './index.types'
  import EditableTable from '../../../components/KeyValueInput'
  import { ServerMessage } from '../../../components/ServerMessage'
  import { transformDataToListMessage } from '../../../helpers/helpers'
  import { BotStepType, SenlerFieldsResponse, } from '../../../types'
import { AmoCrmTransferringSettingsComponent } from '../TransferringSettings'

  const SendDataToAmoCrm = memo(({ data, setData, amoCrmTransferringSettings, setAmoCrmTransferringSettings }: ISendDataToAmoCrm) => {

    const renderData = useMemo(() => data ? data[BotStepType.SendDataToAmoCrm] : [{ from: "", to: "" }], [data])

    const { workspaceInfo } = useWorkspaceInfo()
    const [senlerFields, setSenlerFields] = useState<ISenlerField[]>([])

    const { message, sendMessage } = useMessage()

    useEffect(() => {
      console.log('Rerender SendDataToAmoCrm', data)

      const { senlerGroupId } = getUrlParams();

      if (!senlerGroupId) {
        console.error("Missing required parameters: 'sign' or 'group_id'");
        return;
      }

      const _data = transformDataToListMessage(senlerGroupId)
      sendMessage(_data, window.parent);
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
      <>
        {workspaceInfo.error && (
          <div className="mb-4">
            <ServerMessage message={workspaceInfo.error} />
          </div>
        )}
        <AmoCrmTransferringSettingsComponent
          settings={amoCrmTransferringSettings}
          setSettings={setAmoCrmTransferringSettings}
        />
        <EditableTable
          data={renderData}
          changeData={setSendDataToAmoCrmData}
          toFields={workspaceInfo.fields}
          fromFields={senlerFields}
        />
      </>
    )
  })

  export { SendDataToAmoCrm }
  export type { SendDataToAmoCrmData }

