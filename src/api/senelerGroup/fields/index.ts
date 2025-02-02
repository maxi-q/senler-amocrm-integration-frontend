import axios from "axios";
import { GetAmoCRMFieldsDto, GetSenlerGroupFieldsDto } from "./index.dto";

export const getAmoCRMFields = async ({ sign }: GetAmoCRMFieldsDto) => {
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

    return response.data;
  } catch (error) {
    console.error("Error fetching AmoCRM fields:", error);
    throw error;
  }
};

export const getSenlerGroupFields = async ({ senlerGroupId }: GetSenlerGroupFieldsDto) => {
  try {
    const csrfToken = document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const response = await axios.get(
      `/api/integration/getAmoFields`,
      {
        params: {
          group_id: senlerGroupId
        },
        headers: {
          "Content-Type": "application/json",
          'X-Csrf-Token': csrfToken,
        }
      }
    );

    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching Senler group fields:", error);
    throw error;
  }
};
