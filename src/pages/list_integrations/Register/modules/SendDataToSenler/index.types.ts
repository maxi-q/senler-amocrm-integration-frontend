import { Dispatch, SetStateAction } from "react"
import { type DataManagementRouter } from "../.."
import { type IDataRow } from "../../components/KeyValueInput"

export type SendDataToSenlerData = IDataRow[]

export interface ISendDataToSenler {
  data?: any,
  setData: Dispatch<SetStateAction<DataManagementRouter | undefined>>
}
