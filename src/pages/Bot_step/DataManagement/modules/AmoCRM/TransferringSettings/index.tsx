import { memo, useEffect, useCallback, useMemo, useState } from 'react'

import { AmoCrmTransferringSettings } from '../../../types'
import { useWorkspaceInfo } from '@/hooks/useWorkspaceInfo'
import { NumberInputField, TextInputField } from './ui/TextField'
import { SelectField } from './ui/SelectField'

interface IAmoCrmTransferringSettingsProps {
  settings: AmoCrmTransferringSettings | null
  setSettings: (settings: AmoCrmTransferringSettings | null) => void
}

enum settingsNameStatusEnum {
  NameIsName = 'NameIsName',
  CustomName = 'CustomName'
}

export const AmoCrmTransferringSettingsComponent = memo(({ settings, setSettings }: IAmoCrmTransferringSettingsProps) => {
  const { workspaceInfo } = useWorkspaceInfo()

  const [isCustomName, setIsCustomName] = useState<settingsNameStatusEnum>(settings?.name ? settingsNameStatusEnum.CustomName : settingsNameStatusEnum.NameIsName)

  useEffect(() => {
    if (workspaceInfo.pipelines.length > 0 && !settings) {
      const firstPipeline = workspaceInfo.pipelines[0]
      const defaultSettings: AmoCrmTransferringSettings = {
        pipelineId: firstPipeline.id,
        statusId: firstPipeline.statuses[0]?.id,
        responsibleUserId: workspaceInfo.users[0]?.id,
        price: 0
      }
      setSettings(defaultSettings)
    }
  }, [workspaceInfo, workspaceInfo, settings, setSettings])

    const handleNameTypeChange = useCallback((type: settingsNameStatusEnum)=>{
      setIsCustomName(type)
      if (type == settingsNameStatusEnum.NameIsName) {
        const newSettings: AmoCrmTransferringSettings = {
          ...settings,
          name: ''
        }
        setSettings(newSettings)
      }
    }, [settings, setSettings])

  const handlePipelineChange = useCallback((pipelineId: string) => {
    console.log(pipelineId)
    const pipeline = workspaceInfo.pipelines.find(p => p.id.toString() === pipelineId)
    if (pipeline) {
      if (settings?.pipelineId !== pipeline.id || settings?.statusId !== pipeline.statuses[0]?.id) {
        const newSettings: AmoCrmTransferringSettings = {
          ...settings,
          pipelineId: pipeline.id,
          statusId: pipeline.statuses[0]?.id,
          price: settings?.price || 0
        }
        setSettings(newSettings)
      }
    } else {
      const newSettings: AmoCrmTransferringSettings = {
          ...settings,
          pipelineId: undefined,
          statusId: undefined,
          price: settings?.price || 0
        }
        setSettings(newSettings)
    }
  }, [workspaceInfo, settings, setSettings])

  const handleStatusChange = useCallback((statusId: string) => {
    if (!settings?.pipelineId) return
    const newStatusId = parseInt(statusId)

    if (settings?.statusId !== newStatusId) {
      const newSettings: AmoCrmTransferringSettings = {
        ...settings,
        statusId: newStatusId,
        price: settings?.price || 0
      }
      setSettings(newSettings)
    }
  }, [settings, setSettings])

  const handleUserChange = useCallback((userId: string) => {
    const newUserId = parseInt(userId)

    if (settings?.responsibleUserId !== newUserId) {
      const newSettings: AmoCrmTransferringSettings = {
        ...settings,
        responsibleUserId: newUserId,
        price: settings?.price || 0
      }
      setSettings(newSettings)
    }
  }, [settings, setSettings])

  const handlePriceChange = useCallback((price: string) => {
    const newPrice = parseFloat(price) || 0

    if (settings?.price !== newPrice) {
      const newSettings: AmoCrmTransferringSettings = {
        ...settings,
        price: newPrice
      }
      setSettings(newSettings)
    }
  }, [settings, setSettings])

  const handleNameChange = useCallback((name: string) => {
    if (settings?.name !== name) {
      const newSettings: AmoCrmTransferringSettings = {
        ...settings,
        name: name
      }
      setSettings(newSettings)
    }
  }, [settings, setSettings])

  const pipelinesOptions = useMemo(() => {
    const options = workspaceInfo.pipelines.map(pipeline => ({
      label: pipeline.name,
      value: pipeline.id.toString()
    }))
    options.unshift({
      label: 'Выберете воронку',
      value: ''
    })
    return options
  }, [workspaceInfo.pipelines])

  const statusesOptions = useMemo(()=> {
    const options: {
      label: string;
      value: string;
    }[] = []
    if (settings) {
      options.push(...workspaceInfo.pipelines
        .find(p => p.id === settings.pipelineId)
        ?.statuses.map(status => ({
          label: status.name,
          value: status.id.toString()
        })) || [])
      options.unshift({
        label: 'Не изменять',
        value: ''
      })
    }
    else {
      options.push({
        label: 'Выберете воронку',
        value: ''
      })
    }

    return options
  }, [workspaceInfo.pipelines, settings?.pipelineId])

  const usersOptions = useMemo(()=>{
    const options = workspaceInfo.users.map(user => ({
        label: user.name,
        value: user.id.toString()
      }))

    options.unshift({
      label: 'Не назначать',
      value: 'none'
    })

    return options
  }, [workspaceInfo.users])


  if (workspaceInfo.isLoading) {
    return <div>Загрузка настроек передачи...</div>
  }

  if (workspaceInfo.error) {
    return <div style={{ color: 'red' }}>Ошибка: {workspaceInfo.error}</div>
  }


  return (
    <div style={{ marginTop: '20px' }}>
      <h4 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Настройки передачи в AmoCRM</h4>

      <div style={{ marginBottom: '15px' }}>

        <SelectField
          label="Имя сделки"
          value={isCustomName}
          setValue={handleNameTypeChange }
          options={[{ label: 'Имя клиента', value: settingsNameStatusEnum.NameIsName }, { label: 'Своё значение', value: settingsNameStatusEnum.CustomName }]}
        />
        {
          isCustomName === settingsNameStatusEnum.CustomName ?
            <TextInputField
              label=""
              value={settings?.name?.toString() || ''}
              setValue={(value) => handleNameChange(typeof value === 'string' ? value : value.toString())}
            /> : <></>
        }
      </div>

      <div style={{ marginBottom: '15px' }}>
        <SelectField
          label="Воронка"
          value={settings?.pipelineId?.toString() || ''}
          setValue={handlePipelineChange}
          options={pipelinesOptions}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        {
          settings?.pipelineId ? (
            <SelectField
              label="Статус"
              value={settings?.statusId?.toString() || ''}
              setValue={handleStatusChange}
              options={statusesOptions}
            />
          ) : (
            <p>Для изменения статуса сделки выберете воронку</p>
          )
        }
      </div>

      <div style={{ marginBottom: '15px' }}>
        <SelectField
          label="Ответственный"
          value={settings?.responsibleUserId?.toString() || ''}
          setValue={handleUserChange}
          options={usersOptions}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <NumberInputField
          label="Цена"
          value={settings?.price?.toString() || '0'}
          setValue={(value) => handlePriceChange(typeof value === 'string' ? value : value.toString())}
        />
      </div>
    </div>
  )
})

