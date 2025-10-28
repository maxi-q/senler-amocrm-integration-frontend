  import { memo, useEffect, useMemo, useState } from 'react'

  import { getAmoCRMWorkspaceInfo } from '@/api/Backend/fields/workspaceInfo'
  import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto'
  import { useMessage } from '@/messages/messageProvider'
  import { getUrlParams } from '@/helpers'

  import { ISendDataToAmoCrm, SendDataToAmoCrmData } from './index.types'
  import EditableTable from '../../components/KeyValueInput'
  import { ServerMessage } from '../../components/ServerMessage'
  import { transformDataToListMessage } from '../../helpers/helpers'
  import { BotStepType, SenlerFieldsResponse } from '../../types'
  import { isAxiosError } from 'axios'

  const SendDataToAmoCrm = memo(({ data, setData }: ISendDataToAmoCrm) => {

    const renderData = useMemo(() => data ? data[BotStepType.SendDataToAmoCrm] : [{ from: "", to: "" }], [data])

    const [amoCRMFields, setAmoCRMFields] = useState<IAmoCRMField[]>([])
    const [senlerFields, setSenlerFields] = useState<ISenlerField[]>([])
    const [error, setError] = useState<string | null>(null)

    const { message, sendMessage } = useMessage()

    const getOrThrowAmoCRMFields = async (senlerGroupId: string) => {
      try {
        setError('')
        const { fields } = await getAmoCRMWorkspaceInfo({ senlerGroupId });
        if (!fields) return
        setAmoCRMFields(fields.map(field => new IAmoCRMField(field)))
      } catch (error) {
        if (isAxiosError(error)) {
          setError(error.response?.data.message)
        } else {
          setError("Произошла ошибка при получении полей AmoCRM")
        }
        console.error("Error fetching amoCRM fields in getOrThrowAmoCRMFields:", error);
      }
    };

    useEffect(() => {
      console.log('Rerender SendDataToAmoCrm', data)

      const { senlerGroupId } = getUrlParams();

      if (!senlerGroupId) {
        console.error("Missing required parameters: 'sign' or 'group_id'");
        return;
      }

      getOrThrowAmoCRMFields(senlerGroupId);

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
          changeData={setSendDataToAmoCrmData}
          toFields={amoCRMFields}
          fromFields={senlerFields}
        />
      </>
    )
  })

  export { SendDataToAmoCrm }
  export type { SendDataToAmoCrmData }

