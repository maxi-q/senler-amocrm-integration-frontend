import axios from "axios";

interface getAmoCRMFields {
  sign: string;
}

export class IAmoCRMField {
  "id": string
  "name": string
  "type": string
  "account_id": number
  "code": string
  "sort": number
  "is_api_only": boolean
  "enums": null
  "group_id": string
  "required_statuses": Array<string>
  "is_deletable": boolean
  "is_predefined": boolean
  "entity_type": string
  "tracking_callback": null
  "remind": null
  "triggers": Array<string>
  "currency": null
  "hidden_statuses": Array<string>
  "chained_lists": null
  "_links": {
      "self": {
          "href": string
      }
  }
}

export const getAmoCRMFields = async ({ sign }: getAmoCRMFields): Promise<IAmoCRMField[]> => {
  try {
    const response = await axios.get(
      `/api/integration/getAmoFields`,
      {
        params: {
          sign
        },
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    console.log('response.data', response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching AmoCRM fields:", error);
    throw error;
  }
};
