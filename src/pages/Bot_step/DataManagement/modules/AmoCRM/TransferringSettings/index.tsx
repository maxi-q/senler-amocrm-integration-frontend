import { memo, useEffect, useCallback } from 'react'

import { AmoCrmTransferringSettings } from '../../../types'
import { SelectField } from '../../../components/SelectField'
import { InputField } from '../../../components/TextField'
import { useWorkspaceInfo } from '@/hooks/useWorkspaceInfo'

interface IAmoCrmTransferringSettingsProps {
  settings: AmoCrmTransferringSettings | null
  setSettings: (settings: AmoCrmTransferringSettings | null) => void
}

export const AmoCrmTransferringSettingsComponent = memo(({ settings, setSettings }: IAmoCrmTransferringSettingsProps) => {
  const { workspaceInfo } = useWorkspaceInfo()

  // Устанавливаем значения по умолчанию при первой загрузке данных
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
  }, [workspaceInfo.pipelines, workspaceInfo.users, settings, setSettings])

  const handlePipelineChange = useCallback((pipelineId: string) => {
    const pipeline = workspaceInfo.pipelines.find(p => p.id.toString() === pipelineId)
    if (pipeline) {
      // Проверяем, действительно ли нужно обновить настройки
      if (settings?.pipelineId !== pipeline.id || settings?.statusId !== pipeline.statuses[0]?.id) {
        const newSettings: AmoCrmTransferringSettings = {
          ...settings,
          pipelineId: pipeline.id,
          statusId: pipeline.statuses[0]?.id,
          price: settings?.price || 0
        }
        setSettings(newSettings)
      }
    }
  }, [workspaceInfo.pipelines, settings, setSettings])

  const handleStatusChange = useCallback((statusId: string) => {
    const newStatusId = parseInt(statusId)
    
    // Проверяем, действительно ли нужно обновить настройки
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
    
    // Проверяем, действительно ли нужно обновить настройки
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
    
    // Проверяем, действительно ли нужно обновить настройки
    if (settings?.price !== newPrice) {
      const newSettings: AmoCrmTransferringSettings = {
        ...settings,
        price: newPrice
      }
      setSettings(newSettings)
    }
  }, [settings, setSettings])

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
          label="Воронка"
          value={settings?.pipelineId?.toString() || ''}
          setValue={handlePipelineChange}
          options={workspaceInfo.pipelines.map(pipeline => ({
            label: pipeline.name,
            value: pipeline.id.toString()
          }))}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <SelectField
          label="Статус"
          value={settings?.statusId?.toString() || ''}
          setValue={handleStatusChange}
          options={workspaceInfo.pipelines
            .find(p => p.id === settings?.pipelineId)
            ?.statuses.map(status => ({
              label: status.name,
              value: status.id.toString()
            })) || []}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <SelectField
          label="Ответственный"
          value={settings?.responsibleUserId?.toString() || ''}
          setValue={handleUserChange}
          options={workspaceInfo.users.map(user => ({
            label: user.name,
            value: user.id.toString()
          }))}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <InputField
          label="Цена"
          value={settings?.price?.toString() || '0'}
          setValue={(value) => handlePriceChange(typeof value === 'string' ? value : value.toString())}
        />
      </div>
    </div>
  )
})

