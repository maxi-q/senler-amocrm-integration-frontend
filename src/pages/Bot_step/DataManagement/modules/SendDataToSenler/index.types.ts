import { Dispatch, SetStateAction } from "react"
import { type IDataRow } from "../../components/KeyValueInput"
import { DataManagementRouter } from "../../types"

export type SendDataToSenlerData = IDataRow[]

export interface ISendDataToSenler {
  data?: any,
  setData: Dispatch<SetStateAction<DataManagementRouter | undefined>>
}
