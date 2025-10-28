import { ISenlerField } from "@/api/Backend/fields/workspaceInfo.dto"
import { SendDataToSenlerData } from "./modules/SendDataToSenler"
import { SendDataToAmoCrmData } from "./modules/SendDataToAmoCrm"

export interface privateSetting {
  id: string,
  chat_id: string,
  token: string,
  user_id: string
}

export interface saveMessage {
    payload: {
        public: string,
        private:string,
        command: string,
        description: string,
    },
    success: boolean
}

export interface SenlerFieldsResponse {
  items: Array<ISenlerField>,
  success: boolean,
  count: number,
  end: boolean
}

export interface AmoCrmTransferringSettings {
  pipelineId?: number
  statusId?: number
  price?: number
  name?: string
  responsibleUserId?: number
}

export enum BotStepType {
  SendDataToAmoCrm = 'SEND_DATA_TO_AMO_CRM',
  SendDataToSenler = 'SEND_DATA_TO_SENLER',
}

export let BotStepRuName = {
  [BotStepType.SendDataToAmoCrm]: 'Отправка данных в amoCRM',
  [BotStepType.SendDataToSenler]: 'Отправка данных в senler',
}

export type DataManagementRouter = {
  [key in BotStepType]?
    : key extends BotStepType.SendDataToAmoCrm
    ? SendDataToAmoCrmData
    : key extends BotStepType.SendDataToSenler
    ? SendDataToSenlerData
    : never;
};

type SyncableVariables = SendDataToSenlerData | SendDataToAmoCrmData

export interface PublicBotStepSettingsDto {
  type: BotStepType;
  syncableVariables: SyncableVariables;
  amoCrmTransferringSettings: AmoCrmTransferringSettings | null;
}

export type IPublicTransferData = PublicBotStepSettingsDto & DataManagementRouter

export interface ITransferData {
  public: IPublicTransferData
}

export function isPublicTransferData(data: any): data is IPublicTransferData {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.type === 'string' &&
    Object.values(BotStepType).includes(data.type as BotStepType) &&
    data.syncableVariables &&
    typeof data.syncableVariables === 'object' &&
    (data.amoCrmTransferringSettings === null ||
     (typeof data.amoCrmTransferringSettings === 'object' &&
      !Array.isArray(data.amoCrmTransferringSettings)))
  )
}