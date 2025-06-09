import axios from "axios";
import { IGetSenlerGroupFields } from "./index.types";

export const getSenlerGroupFields = async ({ senlerGroupId }: IGetSenlerGroupFields) => {
  try {
    const csrfToken = document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const response = await axios.get(
      `https://senler.ru/ajax/cabinet/select2vars`,
      {
        params: {
          group_id: senlerGroupId
        },
        headers: {
          "Content-Type": "application/json",
          "X-Csrf-Token": csrfToken,
        }
      }
    )

    return response.data;
  } catch (error) {
    console.error("Error fetching Senler group fields:", error);
    throw error;
  }
};

export const OAuth2token = async ({client_id, client_secret, redirect_uri, code, group_id}: {client_id: string, client_secret: string, redirect_uri: string, code: string, group_id: string}) => {
  console.log('group_id 1 ', group_id)
  try {
    console.log('group_id 2 ', group_id)
    const response = await axios.get<{success: boolean, access_token: string}>(
      `https://senler.ru/ajax/cabinet/OAuth2token`,
      {
        params: {
          client_id: client_id,
          client_secret: client_secret,
          redirect_uri: redirect_uri,
          code: code,
          group_id: group_id
        },
      }
    )

    return response.data
  } catch (error) {
    console.error("Error fetching Senler group fields:", error);
    throw error;
  }
}