import EditableTable, { IDataRow } from '../components/KeyValueInput'
import React, { useEffect, useState } from 'react'
import { BotStepType, DataManagementRouter } from '..'
import { getSenlerGroupFields } from '../../../api/senelerGroup/fields'

export type SendDataToAmoCrmData = IDataRow[]


interface SendDataToAmoCrm {
  data?: any,
  setData: React.Dispatch<React.SetStateAction<DataManagementRouter | undefined>>
}

export const SendDataToAmoCrm = (props: SendDataToAmoCrm) => {
  const [amoLeadFields, setAmoLeadFields] = useState({})

  useEffect(() => {
    (async () => {
      const url = window.location.href
      const params = new URLSearchParams(new URL(url).search)
      const sign = params.get('sign') || ''

      const fields = await getSenlerGroupFields({ sign })

      setAmoLeadFields(fields)
    })()
  }, [])

  useEffect(() => {
    console.log(amoLeadFields)
  }, [amoLeadFields])

  const setSendDataToAmoCrmData = (data: SendDataToAmoCrmData) => {
    props.setData(p => ({...p, [BotStepType.SendDataToAmoCrm]: data }))
  }



	return <EditableTable data={props.data && props.data[BotStepType.SendDataToAmoCrm]} changeData={setSendDataToAmoCrmData} />
}

