import { Dispatch, SetStateAction } from "react"
import { type DataManagementRouter } from "../.."
import { type IDataRow } from "../../components/KeyValueInput"

export type SendDataToAmoCrmData = IDataRow[]

export interface ISendDataToAmoCrm {
  data?: any,
  setData: Dispatch<SetStateAction<DataManagementRouter | undefined>>
}

