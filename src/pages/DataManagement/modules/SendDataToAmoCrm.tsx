import EditableTable, { IDataRow } from '../components/KeyValueInput'
import React, { useEffect, useState } from 'react'
import { BotStepType, DataManagementRouter } from '..'
import { getAmoCRMFields, getSenlerGroupFields } from '../../../api/senelerGroup/fields'

export type SendDataToAmoCrmData = IDataRow[]


interface SendDataToAmoCrm {
  data?: any,
  setData: React.Dispatch<React.SetStateAction<DataManagementRouter | undefined>>
}

export const SendDataToAmoCrm = (props: SendDataToAmoCrm) => {
  const [amoCRMFields, setAmoCRMFields] = useState({})
  const [senlerFields, setSenlerFields] = useState({})


  useEffect(() => {
    (async () => {
      const url = window.location.href
      const params = new URLSearchParams(new URL(url).search)

      const sign = params.get('sign') || ''
      const senlerGroupId = params.get('group_id') || ''

      if (!sign || !senlerGroupId) {
        console.error("Missing required parameters: 'sign' or 'group_id'")
        return
      }

      try {
        const [amoFields, senlerFields] = await Promise.all([
          getAmoCRMFields({ sign }),
          getSenlerGroupFields({ senlerGroupId })
        ])

        setAmoCRMFields(amoFields)
        setSenlerFields(senlerFields)
      } catch (error) {
        console.error("Error fetching data:")
        throw error
      }
    })()
  }, [])

  useEffect(() => {
    console.log(amoCRMFields, senlerFields)
  }, [amoCRMFields, senlerFields])

  const setSendDataToAmoCrmData = (data: SendDataToAmoCrmData) => {
    props.setData(p => ({...p, [BotStepType.SendDataToAmoCrm]: data }))
  }

	return <EditableTable data={props.data && props.data[BotStepType.SendDataToAmoCrm]} changeData={setSendDataToAmoCrmData} />
}

