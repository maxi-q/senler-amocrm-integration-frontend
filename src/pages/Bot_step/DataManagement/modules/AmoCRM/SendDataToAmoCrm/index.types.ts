import { Dispatch, SetStateAction } from "react"
import { type IDataRow } from "../../../components/KeyValueInput"
import { DataManagementRouter, AmoCrmTransferringSettings } from "../../../types"

export type SendDataToAmoCrmData = IDataRow[]

export interface ISendDataToAmoCrm {
  data?: any,
  setData: Dispatch<SetStateAction<DataManagementRouter | undefined>>,
  amoCrmTransferringSettings: AmoCrmTransferringSettings | null,
  setAmoCrmTransferringSettings: (settings: AmoCrmTransferringSettings | null) => void
}

