import { useEffect, useState, useRef, useMemo } from 'react'

import useAccountStore from '@/store/account'
import { useMessage } from '@/messages/messageProvider'
import { useWorkspaceInfo } from '@/hooks/useWorkspaceInfo'
import { getUrlParams } from '@/helpers'

import { SendDataToAmoCrm } from './modules/AmoCRM/SendDataToAmoCrm'
import { SendDataToSenler } from './modules/SendDataToSenler'
import { Loader } from '@/shared/modules/AmoCRM/components/Loader'
import { AmoCRM } from '@/shared/modules/AmoCRM'

import { SelectField } from './components/SelectField'
import { Templates } from './components/Templates'
import { AmoCrmTransferringSettings, BotStepRuName, BotStepType, DataManagementRouter, IPublicTransferData, isPublicTransferData, ITransferData } from './types'
import { deepEqual } from './helpers/helpers'
import { type IDataRow } from './components/KeyValueInput'
import { hasDataValidationErrors } from './components/KeyValueInput/helpers'

export const DataManagement = () => {
  const { message, sendMessage } = useMessage()
  const { isAmoCRMAuthenticated, senlerGroup } = useAccountStore()
  const { workspaceInfo, syncWorkspaceForAmoAccount } = useWorkspaceInfo()

  const [OAuthCode, setOAuthCode] = useState('')

  const [stepType, setStepType] = useState<BotStepType>(BotStepType.SendDataToAmoCrm)

  const [publicData, setPublicData] = useState<DataManagementRouter>()

  const [transferData, setTransferData] = useState<ITransferData>()
  const [dataIsLoaded, setDataIsLoaded] = useState(false)

  const [amoCrmTransferringSettings, setAmoCrmTransferringSettings] = useState<AmoCrmTransferringSettings | null>(null)

  const initialPublicDataRef = useRef<DataManagementRouter | undefined>(undefined)
  const initialAmoCrmTransferringSettingsRef = useRef<AmoCrmTransferringSettings | null | undefined>(undefined)


  const hasUnsavedChanges = useMemo(() => {
    if (initialPublicDataRef.current === undefined || initialAmoCrmTransferringSettingsRef.current === undefined) {
      return false
    }

    const publicDataChanged = !deepEqual(publicData, initialPublicDataRef.current)
    const settingsChanged = !deepEqual(amoCrmTransferringSettings, initialAmoCrmTransferringSettingsRef.current)

    return publicDataChanged || settingsChanged
  }, [publicData, amoCrmTransferringSettings])

  useEffect(() => {
    const { senlerGroupId } = getUrlParams()
    syncWorkspaceForAmoAccount(senlerGroupId, senlerGroup.amoCrmDomainName, isAmoCRMAuthenticated)
  }, [isAmoCRMAuthenticated, senlerGroup.amoCrmDomainName, syncWorkspaceForAmoAccount])


  useEffect(() => {
    let settings = amoCrmTransferringSettings

    if (amoCrmTransferringSettings && settings) {
      for (const [key, value] of Object.entries(amoCrmTransferringSettings)) {
        settings[key as keyof AmoCrmTransferringSettings] = value || null
      }

      settings = Object.keys(settings).length === 0 ? null : settings
    }

    setTransferData(
      {
        public: {
          ...publicData,
          type: stepType,
          syncableVariables: publicData && publicData[stepType] || [],
          amoCrmTransferringSettings: settings
        }
      }
    )
  }, [publicData, stepType, amoCrmTransferringSettings])

  const handleSetData = (mockMessage?: ITransferData) => {
    let { public: publicPayload } = mockMessage ? mockMessage : message.request.payload;

    if (!mockMessage) {
      try {
        publicPayload = JSON.parse(publicPayload || '{}')
      } catch (error) {
        publicPayload = {}
      }
    }

    if (isPublicTransferData(publicPayload)) {
      const parsedPublicData = publicPayload;

      setAmoCrmTransferringSettings(parsedPublicData.amoCrmTransferringSettings)
      setOAuthCode('');
      setStepType(parsedPublicData.type || BotStepType.SendDataToAmoCrm);
      if (!parsedPublicData[BotStepType.SendDataToSenler]) { parsedPublicData[BotStepType.SendDataToSenler] = [] }

      setPublicData(parsedPublicData);

    }

    initialPublicDataRef.current = JSON.parse(JSON.stringify(publicPayload))
    initialAmoCrmTransferringSettingsRef.current = publicPayload.amoCrmTransferringSettings
      ? JSON.parse(JSON.stringify(publicPayload.amoCrmTransferringSettings))
      : null

    setDataIsLoaded(true)
  };

  useEffect(() => {
    const handleGetData = () => {
      if (!publicData) return;

      const currentData = publicData[stepType] || [];
      const toFields = stepType === BotStepType.SendDataToAmoCrm ? workspaceInfo.fields : undefined;

      if (hasDataValidationErrors(currentData, toFields)) {
        return;
      }

      const syncableVariables = currentData.filter(
        (item: IDataRow) => item.from !== '' && item.to !== ''
      ) || null

      const publicPayload: IPublicTransferData = {
        ...publicData,
        type: stepType,
        syncableVariables,
        amoCrmTransferringSettings
      }
      initialPublicDataRef.current = JSON.parse(JSON.stringify(publicData))
      initialAmoCrmTransferringSettingsRef.current = amoCrmTransferringSettings
        ? JSON.parse(JSON.stringify(amoCrmTransferringSettings))
        : null

      const data = {
        id: message.id,
        request: message.request,
        response: {
          payload: {
            public: publicPayload,
            description: 'Интеграция подключена',
            command: BotStepRuName[stepType],
            title: BotStepRuName[stepType],
          },
          success: true,
        },
        time: new Date().getTime(),
      };

      sendMessage(data, window.parent);
    };

    if (!message) return;
    if (message.request?.type === 'getData') handleGetData();
    if (message.request?.type === 'setData') handleSetData();
  }, [message]);

  return (
    <div>
      <AmoCRM OAuthCode={OAuthCode} setOAuthCode={setOAuthCode} />

      {
        isAmoCRMAuthenticated &&
        <>
          {hasUnsavedChanges && (
            <div className="my-4 p-3 rounded border border-red-200 bg-red-50 text-red-800">
              <span className="text-sm font-medium">Настройки не сохранены</span>
            </div>
          )}

          <Margin />

          <Templates data={transferData} setData={handleSetData} />
          <Margin />

          <div className='text-left'>
            <h3>Направление передачи данных</h3>
            <SelectField
              value={stepType}
              setValue={setStepType}
              options={[
                { label: "Отправка данных в amoCRM", value: BotStepType.SendDataToAmoCrm },
                { label: "Отправка данных в Senler", value: BotStepType.SendDataToSenler },
              ]}
            />
          </div>

          <div className='mt-8 relative'>
            {
              dataIsLoaded ?
                <>
                  {stepType == BotStepType.SendDataToAmoCrm && (
                    <SendDataToAmoCrm
                      key={senlerGroup.amoCrmDomainName}
                      data={publicData}
                      setData={setPublicData}
                      amoCrmTransferringSettings={amoCrmTransferringSettings}
                      setAmoCrmTransferringSettings={setAmoCrmTransferringSettings}
                    />
                  )}
                  {stepType == BotStepType.SendDataToSenler && (
                    <SendDataToSenler key={senlerGroup.amoCrmDomainName} data={publicData} setData={setPublicData} />
                  )}
                </> :
                <Loader />
            }
          </div>
        </>
      }
    </div>
  )
}

const Margin = () => <div className='w-full my-10' />
