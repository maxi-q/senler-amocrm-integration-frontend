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
