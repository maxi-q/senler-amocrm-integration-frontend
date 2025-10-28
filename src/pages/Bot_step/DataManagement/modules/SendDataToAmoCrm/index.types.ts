import { Dispatch, SetStateAction } from "react"
import { type IDataRow } from "../../components/KeyValueInput"
import { DataManagementRouter } from "../../types"

export type SendDataToAmoCrmData = IDataRow[]

export interface ISendDataToAmoCrm {
  data?: any,
  setData: Dispatch<SetStateAction<DataManagementRouter | undefined>>
}

