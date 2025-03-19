import { ISenlerField } from "@/api/Backend/fields/fields.dto"

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