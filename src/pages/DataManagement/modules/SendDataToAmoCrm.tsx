import EditableTable, { IDataRow } from '../components/KeyValueInput'
import React from 'react'
import { BotStepType, DataManagementRouter } from '..'

export type SendDataToAmoCrmData = IDataRow[]


interface SendDataToAmoCrm {
  data?: any,
  setData: React.Dispatch<React.SetStateAction<DataManagementRouter | undefined>>
}

export const SendDataToAmoCrm = (props: SendDataToAmoCrm) => {

  const setSendDataToAmoCrmData = (data: SendDataToAmoCrmData) => {
    props.setData(p => ({...p, [BotStepType.SendDataToAmoCrm]: data }))
  }

	return <EditableTable data={props.data && props.data[BotStepType.SendDataToAmoCrm]} changeData={setSendDataToAmoCrmData} />
}

