import EditableTable, { IDataRow } from '../components/KeyValueInput'
import React from 'react'
import { DataManagementRouter } from '..'

export interface SendDataToAmoCrmData {
  data?: IDataRow[],
}

interface SendDataToAmoCrm {
  data?: IDataRow[],
  setData: React.Dispatch<React.SetStateAction<DataManagementRouter | undefined>>
}

export const SendDataToAmoCrm = (props: SendDataToAmoCrm) => {

  const setSendDataToAmoCrmData = (data: IDataRow[]) => {
    props.setData(p => ({...p, sendDataToAmoCrm: { data }}))
  }

	return (
		<div>
      <EditableTable data={props.data || []} changeData={setSendDataToAmoCrmData} />
		</div>
	)
}

