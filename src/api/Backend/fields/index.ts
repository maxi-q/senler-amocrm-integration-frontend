import axios from "axios";
import { IAmoCRMField } from "./fields.dto";

interface getAmoCRMFields {
  sign: string;
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
